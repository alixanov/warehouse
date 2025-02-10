import React, { useState } from 'react';
import { useCreateParameterMutation, useGetParametersQuery, useUpdateParameterMutation } from '../../context/services/parameters.service';
import Table from '../../components/table/table';
import { Button, Modal } from 'antd';
import { IoIosAdd } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { MdEdit } from 'react-icons/md';

const Home = () => {
    const { data: parameters = [] } = useGetParametersQuery();
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [submitParameter] = useCreateParameterMutation();
    const [editParameter] = useUpdateParameterMutation();
    const { register, handleSubmit, reset } = useForm();
    const [editingParameter, setEditingParameter] = useState({
        path: "",
        name: "",
        id: "",
    })
    const [isOpen, setIsOpen] = useState(false);
    async function createParameter(data) {
        try {
            if (editingParameter.id) {
                await editParameter({ body: data, path: editingParameter.path, id: editingParameter.id })
                    .then((res) => {
                        console.log(res);
                        reset();
                        setIsOpen(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {

                await submitParameter({ body: data, path: selectedColumn })
                    .then((res) => {
                        console.log(res);
                        reset();
                        setIsOpen(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            reset();
            setEditingParameter({
                path: "",
                name: "",
                id: "",
            })
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            return;
        }
    }
    const columns = ["order", "brigada", "partiya", "section", "responsible", "document"];
    const columnNames = {
        "order": "Hoмep заказа",
        "brigada": "Бригада",
        "partiya": "Номер партии",
        "section": "Подразделение",
        "responsible": "Ответственный",
        "document": "Номер документа"
    };
    const maxLength = Math.max(
        parameters.brigada?.length || 0,
        parameters.partiya?.length || 0,
        parameters.order?.length || 0,
        parameters.section?.length || 0,
        parameters.document?.length || 0,
        parameters.responsible?.length || 0
    );

    const handleDoubleClick = (column, index) => {
        const item = parameters[column] && parameters[column][index];
        if (item) {
            setEditingParameter({
                path: column,
                name: item.name,
                id: item._id,
            })
            reset({ name: item.name });
            setIsOpen(true);
        }
    };
    return (
        <div className='page'>
            <Modal
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                onCancel={() => { setIsOpen(false), reset() }}
                title="Добавить новый параметр"
                footer={[]}
                open={isOpen}
            >
                <form autoComplete='off' style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={handleSubmit(createParameter)}>
                    <input style={{ height: "40px", borderRadius: "4px", paddingInline: "6px", border: "1px solid #ccc" }} type="text" {...register("name")} />
                    <button style={{ height: "40px", borderRadius: "4px", textAlign: "center", background: "#26944a", border: "none", color: "#fff" }}>
                        Отправить
                    </button>
                </form>
            </Modal>
            <div className="page_header">
                <h1>Параметры</h1>
            </div>
            <Table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <td key={col}>
                                <Button
                                    onClick={() => {
                                        setSelectedColumn(col);
                                        setIsOpen(true);
                                    }}
                                    style={{ background: "#26944a", fontSize: "20px", fontWeight: "600" }}
                                    type='primary'
                                >
                                    <IoIosAdd />
                                </Button>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {columns.map((col) => (
                            <td key={col}>{columnNames[col]}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: maxLength }).map((_, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td onDoubleClick={() => handleDoubleClick(col, index)} key={col}>
                                    {parameters[col] && parameters[col][index] ? parameters[col][index].name || parameters[col][index].number : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Home;
