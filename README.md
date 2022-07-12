# 启动

安装依赖

```bash
yarn
```

启动项目

```
yarn dev
```

# 实现一个 antd-form

在前端学习的入门阶段，使用组件库的过程中，我总是觉得能写出这种东西的人真的太厉害了，但是随着深入学习，我发现之所以觉得厉害其实是因为你不知道他是怎么实现的，人总是对未知的东西感到神秘，当了解了他的实现方式时，你就会茅塞顿开

<!-- more -->

`antd-form`是基于`rc-field-form`实现的，所以本文从 0 实现一个最简单的`rc-field-form`，是为了了解核心原理

`antd-form`表单的开发有三个最重要的组成部分，分别是

- useForm
- Form
- Form.Item

其中，`Form.Item`是由`rc-field-form`中的`Field`封装而来，所以下文中我提到的都是`Field`

# useForm

先来写一个表单的最简使用：

```js
const [form] = useForm();

return (
  <Form
    form={form}
    onFinish={(values: any) => {
      console.log('onFinish执行，值为：', values);
    }}
  >
    <Field name="nickname">
      <Input placeholder="请输入昵称" />
    </Field>
    <Field name="doing">
      <Input placeholder="请输入在做的事" />
    </Field>
  </Form>
);
```

我们可以看到，表单在使用之前通过`useForm`拿到了`form`这个东西，`form`被传入到`Form`组件中，那这个`form`到底是个啥？

我们把这个`form`打印出来:

![](https://yangblogimg.oss-cn-hangzhou.aliyuncs.com/blogImg/20220712171308.png)

发现他是一个挂载了许多方法的对象实例，`useForm`的实现如下：

```js
  const useForm = (form?: FormInstance) => {
  // 创建一个ref保存表单
  const formRef = useRef<FormInstance>();
  // 防止表单重复创建
  if (!formRef.current) {
    // 如果有传参,ref为传进来的表单，否则创建表单实例对象
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }
  // 返回数组 方便扩展
  return [formRef.current];
};
```

在`useForm`的实现中，其实暴露出去的`form`就是`FormStore`这个类的实例上的`getForm`方法,`getForm`方法获取了类的所有可访问属性，这个`FormStore`是表单的核心所在，是保存表单所有状态和处理表单操作的中心。他的基本结构是这样的：

```js
class FormStore {
  // 用来保存表单数据
  private store: Store = {};

  //...各种方法,主要是对表单数据的操作

  getForm = () => {
    return {
     // 暴露出去供外界使用的各种方法
    };
  };
}
```

总结一下`useForm`中的操作就是 new 了一个`FormStore`对象，获取到了`FormStore`对象实例中所有能供外界访问的数据和方法。

# Form
