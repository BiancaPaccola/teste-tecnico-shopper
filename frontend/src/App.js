import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendFile, setSendFile] = useState(false);
  const [displayTable, setDisplayTable] = useState(false);

  useEffect(() => {
    validation &&
      validation.forEach((item) => {
        if (item.status !== "VALIDADO") {
          setSendFile(false);
          return 0;
        } else {
          setSendFile(true);
        }
      });
  }, [validation, sendFile]);

  const handleCSV = (e) => {
    setDisplayTable(false);
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:3003/", formData)
      .then((response) => {
        setValidation(response.data);
        setDisplayTable(true);
        setIsLoading(false);
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  const setProducts = () => {
    axios
      .put("http://localhost:3003/", validation)
      .then((response) => {
        setMessage(response.data.message);
        setModal(true);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  };

  const restartApplication = () => {
    setFile(null);
    setValidation([]);
    setMessage("");
    setSendFile(false);
    setDisplayTable(false);
    setModal(false);
  };

  if (!modal) {
    return (
      <>
        <h1>Carregue seu arquivo abaixo:</h1>
        <input type="file" name="file" onChange={handleCSV} />
        {file && <button onClick={handleUpload}>Validar</button>}
        {displayTable && (
          <table>
            <thead>
              <th>Código</th>
              <th>Nome do Produto</th>
              <th>Preço Atual</th>
              <th>Novo Preço</th>
              <th>Status</th>
            </thead>

            <tbody>
              {validation &&
                validation.map((product) => {
                  const { code, name, price, newPrice, status } = product;
                  return (
                    <tr key={product.code}>
                      <td>{code}</td>
                      <td>{name}</td>
                      <td>R$ {price}</td>
                      <td>R$ {newPrice}</td>
                      <td
                        className={
                          status === "VALIDADO"
                            ? "validate-true"
                            : "validate-false"
                        }
                      >
                        {status}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
        {isLoading && !displayTable && <h2>Carregando...</h2>}
        {sendFile && displayTable && (
          <button onClick={setProducts}>Enviar</button>
        )}
      </>
    );
  } else {
    return (
      <>
        <h1 className="modal">{message}</h1>
        <button onClick={restartApplication}>Voltar</button>
      </>
    );
  }
}

export default App;
