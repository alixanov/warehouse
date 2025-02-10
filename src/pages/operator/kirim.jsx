import React, { useEffect, useRef, useState } from "react";
import { useGetParametersQuery } from "../../context/services/parameters.service";
import { useForm } from "react-hook-form";
import "./kirim.css";
import { useAddProductMutation } from "../../context/services/product.service";
import { Button, Modal } from "antd";
import QrCode from "qrcode.react";
import moment from "moment-timezone";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { io } from "socket.io-client";
const Kirim = () => {
  const headers = { transports: ["websocket"] };

  const socket = io("http://localhost:8080/", headers);
  const { data: params = [] } = useGetParametersQuery();
  const { register, handleSubmit,  } = useForm();
  const [quantity, setQuantity] = useState(null);
  const [addProduct] = useAddProductMutation();
  const printContentRef = useRef();
  const [density, setDensity] = useState(null);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});
  function onSubmit(data) {
    data.quantity = Number(quantity);
    data.density = Number(density);
    if (
      !data.partiya ||
      !data.order ||
      !data.section ||
      !data.created_date ||
      !data.document ||
      !data.density ||
      !data.brigada ||
      !data.responsible
    ) {
      alert("Заполните все поля");
      return;
    }
    addProduct(data)
      .then((res) => {
        setProduct(res.data);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при добавлении товара");
      });
    console.log(data);
  }
  useEffect(() => {
setDensity(Number((quantity / 48).toFixed(2)));
  }, [quantity]);

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: "new document",
    pageStyle: "style",
    onAfterPrint: () => {
      setOpen(false);
    },
  });
  
  return (
    <div className="kirim">
      <Modal
        width={850}
        height={590}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[<Button onClick={handlePrint} icon={<FaPrint />}></Button>]}
      >
        <div ref={printContentRef} className="print_container">
          <div className="print_header">
            <h1>
              {
                params?.brigada?.find((item) => item._id === product.brigada)
                  ?.name
              }
            </h1>
            <h1>1.6 длина: 30м</h1>
          </div>
          <div className="print_body">
            <div className="body_left">
              <QrCode
                size={162}
                id="qrcode"
                value={product?._id || "Неизвестный товар"}
              />
            </div>
            <div className="body_right">
              <p>
                Номера заказа:{" "}
                <span>
                  {
                    params?.order?.find((item) => item._id === product?.order)
                      ?.name
                  }
                </span>
              </p>
              <p>
                Дата заказа: <span>{product?.order_date}</span>
              </p>
              <p>
                Подразделение:{" "}
                <span>
                  {
                    params?.section?.find(
                      (item) => item._id === product?.section
                    )?.name
                  }
                </span>
              </p>
              <p>
                Ответственный:{" "}
                <span>
                  {
                    params?.responsible?.find(
                      (item) => item._id === product?.responsible
                    )?.name
                  }
                </span>
              </p>
              <p>
                Время выполнения:{" "}
                <span>
                  {moment().tz("Asia/Tashkent").format("DD-MM-YYYY HH:mm")}
                </span>
              </p>
              <p>
                Номер партии:{" "}
                <span>
                  {
                    params?.partiya?.find(
                      (item) => item._id === product?.partiya
                    )?.name
                  }
                </span>
              </p>
              <p>
                Бригада:{" "}
                <span>
                  {
                    params?.brigada?.find(
                      (item) => item._id === product?.brigada
                    )?.name
                  }
                </span>
              </p>
              <p>
                плотность (г/м2): <span>{product?.density}</span>
              </p>
              <p>
                Вес(кг): <span>{product?.quantity}кг</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputs">
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            type="number"
            placeholder="0"
          />
          <select {...register("partiya")}>
            <option value="">Выберите нoмep партии</option>
            {params?.partiya?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
          <select {...register("order")}>
            <option value="">Выберите нoмep заказа</option>
            {params?.order?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
          <select {...register("section")}>
            <option value="">Выберите подразделение</option>
            {params?.section?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
          <input type="date" {...register("created_date")} />
          <select {...register("document")}>
            <option value="">Выберите нoмep документа</option>
            {params?.document?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
          <input type="number" value={density} />

          <select {...register("brigada")}>
            <option value="">Выберите бригаду</option>
            {params?.brigada?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
          <select {...register("responsible")}>
            <option value="">Выберите oтветственный</option>
            {params?.responsible?.map((param) => (
              <option key={param._id} value={param._id}>
                {param.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Kirim;
