import { useState } from "react";


export default function contador (){
    const [contador, setContador] = useState<number>(0);

    const contar = () : void => {
        setContador(contador+1);
    }

    return (
        <button onClick={contar}>
            {contador}
        </button>
    )
}