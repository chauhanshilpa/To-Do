import React from "react";

/**
 * @param {*} props
 * @returns a popup box having a button, a title and a body.
 */
const Modal = (props) => {
  const { modalButtonRef, modalTitle, modalBody } = props;

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={modalButtonRef}
        style={{ display: "none" }}
      >
        click me to see modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {modalTitle}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{modalBody}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
