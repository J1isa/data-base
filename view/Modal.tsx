import React, { useState, JSX, createRef } from "preact/compat";

import "./Modal.sass"

const state = {
  setModal(v: JSX.Element) { }
}

export const closeModal = () => {
  state.setModal(null)
}

export const setModal = (v: JSX.Element) => {
  state.setModal(v)
}

export const modalAlert = (title: string) => {
  return new Promise<void>((resolve) => {
    state.setModal(
      <div className="alert">
        <pre>{title}</pre>
        <div className="buttons">
          <button onClick={
            () => (resolve(), setModal(null))
          }>Ok</button>
        </div>
      </div>
    )
  })
}

export const modalConfirm = (title: string, buttons = ['Да', 'Нет']) => {
  return new Promise<boolean>((resolve) => {
    state.setModal(
      <div className="confirm">
        <pre>{title}</pre>
        <div className="buttons">
          <button onClick={
            () => (resolve(false),setModal(null))
          }>{buttons[1]}</button>

          <button onClick={
            () => (resolve(true), setModal(null))
          }>{buttons[0]}</button>
        </div>
      </div>
    )
  })
}


export const modalInput = (title: string, defaultValue = '') => {
  const ref = createRef<HTMLInputElement>()

  return new Promise<string>((resolve) => {
    state.setModal(
      <div className="input">
        <pre>{title}</pre>
        <input value={defaultValue} ref={ref} />
        <div className="buttons">
          <button onClick={
            () => (resolve(ref.current.value), setModal(null))
          }>Отмена</button>

          <button onClick={
            () => (resolve(ref.current.value), setModal(null))
          }>Ок</button>

        </div>
      </div>
    )
  })
}

export const useModal = (): [JSX.Element, (v: JSX.Element) => void] => {
  const [show, setShow] = useState<JSX.Element>(null)

  state.setModal = setShow

  return [
    show ? (
      <div className="modal-component">
        <div className="modal-window">
          <button className={'close'} onClick={() => setShow(null)}>x</button>
          {show}
        </div>
      </div>
    ) : null,
    setShow
  ]
}