import { useState } from 'react'
import Form, { Field, useForm } from './components/FieldForm';
import Input from './components/Input';

import styles from './App.module.less'
function App() {
  const [form] = useForm();

  const handleValidata = () => {
    form
      .validateFields()
      .then((result: any) => {
        console.log('验证通过，值为：', result);
      })
      .catch((err: any) => {
        console.log('验证失败：', err);
      });
  }
  const handleSubmit = () => {
    const result = form.submit()
    console.log(result);

  }
  return (
    <div className={styles.main}>
      <div className={styles.form}>
        <Form
          // 传入使用useForm创建的表单实例对象
          form={form}
          onFinish={(values: any) => {
            console.log('onFinish执行，值为：', values);
          }}
          onValuesChange={(changed: any, store: any) => {
            console.log('改变的值：', changed, '当前表单值：', store);
          }}
          initialValues={{
            nickname: '默认值',
          }}
        >
          <Field
            name="nickname"
            rules={[
              {
                required: true,
                message: '昵称必填',
              },
            ]}
          >
            <Input placeholder="请输入昵称" />
          </Field>
          <Field
            name="doing"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入在做的事" />
          </Field>
        </Form>
      </div>
      <div className={styles.btnGroup}>
        <button onClick={handleValidata}>验证</button>
        <button onClick={() => { form.resetFields() }}> 重置表单</button>
        <button onClick={handleSubmit}>提交</button>
      </div>

    </div >
  );
}

export default App
