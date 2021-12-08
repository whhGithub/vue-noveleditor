// 标题菜单的 class ，可作为 DropList 菜单的参考代码
import { DropListMenu } from "wangeditor"
import E from "wangeditor"
class Head extends DropListMenu {
    constructor(editor) {
        // 菜单栏中，标题菜单的 DOM 元素
        // 注意，这里的 $ 不是 jQuery ，是 E.$ （wangEditor 自带的 DOM 操作工具，类似于 jQuery）
        // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
        const $elem = E.$(
            '<div class="w-e-menu" data-title="标题"><i class="w-e-icon-header"></i></div>'
        );

        // droplist 配置
        const dropListConf = {
            width: 100,
            title: "设置标题",
            type: "list",
            list: [
                { $elem: E.$("<h1>H1</h1>"), value: "<h1>" },
                { $elem: E.$("<h2>H2</h2>"), value: "<h2>" },
                { $elem: E.$("<p>正文</p>"), value: "<p>" },
            ],
            // droplist 每个 item 的点击事件
            clickHandler: (value) => {
                // value 参数即 dropListConf.list 中配置的 value
                this.command(value);
            },
        };

        super($elem, editor, dropListConf);
    }

    command(value) {
        // 设置标题
        this.editor.cmd.do("formatBlock", value);
    }

    // 菜单是否需要激活
    tryChangeActive() {
        const reg = /^h/i;
        const cmdValue = this.editor.cmd.queryCommandValue("formatBlock");
        if (reg.test(cmdValue)) {
            // 选区处于标题内，激活菜单
            this.active();
        } else {
            // 否则，取消激活
            this.unActive();
        }
    }
}
export {
    Head
}