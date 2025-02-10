import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSellProductMutation } from '../../context/services/product.service';
import { Button, message } from 'antd';

const SellProduct = () => {
    const { register, handleSubmit, reset } = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef();
    const [sellProductMutation] = useSellProductMutation();

    async function onSubmit(data) {
        try {
            const response = await sellProductMutation({ product_id: data.id });
            if (response.error) {
                // Assuming the backend sends errors in `error` field
                messageApi.error(response.error.data?.error || 'Не удалось продать товар');
            } else {
                messageApi.success('Товар успешно продан!');
                reset(); // Clear the input field
            }
        } catch (err) {
            messageApi.error('Произошла ошибка при продаже товара');
            console.error(err);
        }
    }

    return (
        <div className='page'>
            {contextHolder}
            <div className="page_header">
                <h1>Продажа товаров</h1>
            </div>
            <form
                style={{ width: "100%", display: "flex", justifyContent: 'center', marginTop: "50px" }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    style={{ width: "50%", height: "50px", paddingInline: "12px" }}
                    ref={inputRef}
                    autoFocus
                    {...register("id", { required: true })}
                    type="text"
                    placeholder='ID товара'
                />
            </form>
        </div>
    );
};

export default SellProduct;
