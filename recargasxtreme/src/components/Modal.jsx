import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, itemId }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [DolarParalelo, setDolarParalelo] = useState("");
  const [Dolar, setDolar] = useState("");
  useEffect(() => {
    fetch("https://ve.dolarapi.com/v1/dolares")
      .then((response) => response.json())
      .then((data) => {
        setDolarParalelo(data[1].promedio);
        setDolar(data[0].promedio);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!isOpen || itemId === null) {
        setData(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        // 2. The actual fetch call, passing the abort signal
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/opcions?filters[product][id][$eq]=${itemId}&populate=product`,
          { signal },
        );

        // 3. Catch HTTP errors (fetch doesn't throw errors for 404s automatically)
        if (!response.ok) {
          throw new Error(`Data not found (Error ${response.status})`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        // 4. Ignore the error if it was caused by us intentionally aborting the request
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        // Stop the loading spinner only if the request wasn't cancelled
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [isOpen, itemId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 relative opacity-100 p-6 rounded-lg shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {isLoading ? (
          <div role="status" className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#145cfa"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : error ? (
          <div style={{ color: "red" }}>
            <h2>Oops!</h2>
            <p>{error}</p>
          </div>
        ) : data && data.data && data.data.length > 0 ? (
          <>
            <button
              className="close-button absolute top-0 right-2 p-1 text-white text-2xl font-bold"
              onClick={onClose}
            >
              &times;
            </button>
            <div>
              <h2>{data.data[0].product?.Nombre || "Producto"}</h2>
              <div className="my-2 grid grid-cols-2 gap-4 ">
                {data.data.map((opcion) => (
                  <div
                    key={opcion.id}
                    className="border rounded-lg text-sm p-2 bg-gray-700 text-white"
                  >
                    <p>{opcion.TipoCoin} </p>
                    <p>
                      {Math.trunc(opcion.Precio * DolarParalelo * 100) / 100}{" "}
                      Bs.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form className="flex flex-col gap-2 my-4">
              <label htmlFor="id" className="text-sm text-white">
                ID/Cuenta usuario:
              </label>
              <input
                type="text"
                id="id"
                name="id"
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <label htmlFor="email" className="text-sm text-white">
                Correo electrónico:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <label htmlFor="phone" className="text-sm text-white">
                Número de teléfono:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <label htmlFor="payment" className="text-sm text-white">
                Método de pago:
              </label>
              <select
                id="payment"
                name="payment"
                className="p-2 rounded-lg bg-gray-700 text-white"
              >
                <option value="pago-movil">Pago movil</option>
                <option value="zinli">Zinli</option>
                <option value="binance">Binance</option>
                <option value="kontigo">Kontigo</option>
              </select>
            </form>
            <button
              id="cart"
              className="bg-yellow-500 py-1 px-2 rounded-lg text-black"
            >
              Añadir al carrito
            </button>
          </>
        ) : (
          <p>No hay opciones disponibles para este producto.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
