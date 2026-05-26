// content.js（完整版，已修正占位符填充逻辑）
(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (document.getElementById('auto-rating-panel')) return;

        const panel = createControlPanel();
        document.body.appendChild(panel);

        document.getElementById('btn-very-agree')?.addEventListener('click', () => fillEvaluation('非常认同'));
        document.getElementById('btn-agree')?.addEventListener('click', () => fillEvaluation('较为认同'));
        document.getElementById('btn-normal')?.addEventListener('click', () => fillEvaluation('一般认同'));
        document.getElementById('btn-disagree')?.addEventListener('click', () => fillEvaluation('不认同'));
    }

    function createControlPanel() {
        const container = document.createElement('div');
        container.id = 'auto-rating-panel';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        `;

        const buttons = [
            { id: 'btn-very-agree', text: '全部非常认同', color: '#2ecc71' },
            { id: 'btn-agree', text: '全部较为认同', color: '#3498db' },
            { id: 'btn-normal', text: '全部一般认同', color: '#f39c12' },
            { id: 'btn-disagree', text: '全部不认同/非常不认同', color: '#e74c3c' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                color: white;
                background-color: ${btn.color};
                transition: opacity 0.2s;
            `;
            button.onmouseover = () => button.style.opacity = '0.9';
            button.onmouseout = () => button.style.opacity = '1';
            container.appendChild(button);
        });

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 2px;
            right: 8px;
            cursor: pointer;
            color: white;
            font-weight: bold;
            font-size: 16px;
        `;
        closeBtn.addEventListener('click', () => container.remove());
        container.appendChild(closeBtn);

        return container;
    }

    // 等级映射关键词
    const LEVEL_KEYWORDS = {
        '非常认同': ['非常认同', '基本都在听课', '非常有兴趣'],
        '较为认同': ['较为认同', '大部分学生在听课', '较有兴趣'],
        '一般认同': ['一般认同', '大概有一半学生在听课', '兴趣一般'],
        '不认同': ['不认同', '非常不认同', '少部分学生在听课', '很少学生在听课', '没有兴趣', '不喜欢']
    };

    function fillEvaluation(level) {
        const panelContent = document.getElementById('panel_content');
        if (!panelContent) {
            showToast('未找到评价内容区域，请确保已进入评价页面');
            return;
        }

        const allRadios = panelContent.querySelectorAll('input[type="radio"]');
        if (allRadios.length === 0) {
            showToast('当前页面未发现评价题目，请先选择课程加载评价内容');
            return;
        }

        const radioGroups = new Map();
        allRadios.forEach(radio => {
            const name = radio.name;
            if (name) {
                if (!radioGroups.has(name)) radioGroups.set(name, []);
                radioGroups.get(name).push(radio);
            }
        });

        let filledCount = 0, notFoundCount = 0;

        for (const [name, radios] of radioGroups.entries()) {
            const targetRadio = findRadioByKeywords(radios, LEVEL_KEYWORDS[level]);
            if (targetRadio) {
                if (!targetRadio.checked) {
                    targetRadio.checked = true;
                    targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
                    targetRadio.dispatchEvent(new Event('click', { bubbles: true }));
                }
                filledCount++;
            } else {
                notFoundCount++;
                console.warn(`未找到匹配选项，题目组: ${name}, 等级: ${level}`);
            }
        }

        fillLastTwoTextInputs();  // 修改函数名更准确
        showToast(`批量填充完成！成功处理 ${filledCount} 道题目，${notFoundCount} 道未找到匹配选项。`);
    }

    function findRadioByKeywords(radios, keywords) {
        for (const radio of radios) {
            const optionText = getRadioOptionText(radio);
            if (optionText) {
                for (const kw of keywords) {
                    if (optionText.includes(kw)) {
                        return radio;
                    }
                }
            }
        }
        return null;
    }

    function getRadioOptionText(radio) {
        let parent = radio.parentElement;
        if (parent && parent.tagName === 'LABEL') {
            const clone = parent.cloneNode(true);
            const radioClone = clone.querySelector('input[type="radio"]');
            if (radioClone) radioClone.remove();
            const text = clone.innerText.trim();
            if (text) return text;
        }
        if (radio.id) {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label) return label.innerText.trim();
        }
        let sibling = radio.nextElementSibling;
        if (sibling && sibling.innerText) return sibling.innerText.trim();
        if (parent) {
            const text = parent.innerText.trim();
            if (text) return text;
        }
        return '';
    }

    /**
     * 填充页面中最后两个可输入的控件（包括 input 和 textarea）
     * 排除 type="hidden" 的 input，以及可见性为 none 或 hidden 的控件
     */
    function fillLastTwoTextInputs() {
        // 获取所有 input（非隐藏）和 textarea
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea'));
        // 过滤掉不可见的、禁用的
        const visibleInputs = inputs.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled;
        });

        const placeholder = '';
        if (visibleInputs.length >= 2) {
            const secondLast = visibleInputs[visibleInputs.length - 2];
            const last = visibleInputs[visibleInputs.length - 1];
            if (secondLast) {
                secondLast.value = placeholder;
                triggerInputEvent(secondLast);
            }
            if (last) {
                last.value = placeholder;
                triggerInputEvent(last);
            }
            console.log(`已填充最后两个输入控件: ${secondLast?.tagName} ${last?.tagName}`);
        } else {
            console.warn(`未找到至少两个可见的输入控件（input/textarea），仅找到 ${visibleInputs.length} 个`);
        }
    }

    function triggerInputEvent(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function showToast(message) {
        let toast = document.getElementById('auto-rating-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'auto-rating-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 20px;
                background: #333;
                color: #fff;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                font-family: sans-serif;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2000);
    }
})();