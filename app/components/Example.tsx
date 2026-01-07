// Type '(e: Event) => void' is not assignable to type 'FormEventHandler<HTMLFormElement>'.

/*
    HTMLElement
    HTMLDivElement
    HTMLButtonElement
    etc...
*/

import { FormEventHandler } from "react";

function Example() {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    //      HTMLFormElement
    let form = e.currentTarget;
  };

  return (
    <>
      <form onSubmit={handleSubmit}></form>
    </>
  );
}

export default Example;
