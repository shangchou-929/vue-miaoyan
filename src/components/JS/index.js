import Vue from 'vue'
import MessageBox from './MessageBox'
//转为JS
export var messageBox = (function () {
    //默认样式
    var defaults = {
        title: '',
        content: '',
        cancel: '',
        ok: '',
        handleCancel: null,
        handleOk: null
    };
    return function (opts) {
        //根据输入的参数设置盒子的样式和点击方法
        for (var attr in opts) {
            defaults[attr] = opts[attr];
        }

        var MyComponent = Vue.extend(MessageBox);

        var vm = new MyComponent({
            el: document.createElement('div'),
            data: {
                title: defaults.title,
                content: defaults.content,
                cancel: defaults.cancel,
                ok: defaults.ok
            },
            methods: {
                handleCancel() {
                    defaults.handleCancel && defaults.handleCancel.call(this);
                    document.body.removeChild(vm.$el);
                },
                handleOk() {
                    defaults.handleOk && defaults.handleOk.call(this);
                    document.body.removeChild(vm.$el);
                }
            }
        });
        document.body.appendChild(vm.$el);
    }

})();