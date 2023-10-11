import React from "react";

/**
 *
 * @param {*} props
 * @returns a popup component when there is unsuccessful api call
 */
const Modal = (props) => {
  const { modalButtonRef } = props;
  
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
        Launch demo modal
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
                Error
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Oops, something went wrong. Please try again later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
