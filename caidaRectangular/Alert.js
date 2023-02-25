/**
 * OrozcoOscar
 * v1.0
 * 19/09/22
 */
/**
     * Genera una Alerta con Alert.alert(...)
     */

class Alert {
        static #opction;
        static #css=`
            width: -webkit-fill-available;
            height: -webkit-fill-available;
            background: #000000e3;
            position: absolute;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        static #css2 = `
                width: 50%;
                min-height: 4rem;
                background: white;
                padding: 1rem;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                `;
        static #cssColors = ["#2ba52b;", "#a83828;", "#696868;", "#39659d;", "#ede814;"];
        static #div = document.createElement("div")
        
    
    /**
     * Genera una Alerta
     * @param text { title:String|HTML, contenido:String|HTML }.
     * @param opction Configuracion de botones Ejem. [
     * { name: "Aceptar", -> Nombre del Boton
     *  onclick:()=>{}, -> Accion a Realizar despues del Click
     *  type: 1 -> tipo de Boton [1,2,3,4,5]
     *  }]
     */

    static alert(text = { title: "", contenido: "" },opction = [{ name: "Aceptar", onclick:()=>{}, type: 1 }]) {
        this.#opction=opction
        this.#div.id="ALERTMODAL"
        this.#div.setAttribute("style", this.#css)
        let aux = ""
        opction.map(op =>{
            let temp=`<button 

            onclick="Alert.close('${op.name}')"
            style="padding: .5rem;
            border: none;
            background: ${this.#cssColors[op.type - 1]}
            color: white;
            border-radius: 5px;
            margin: 1rem;
            cursor:pointer;
        "
        >${op.name}</button>`
        aux +=temp
    })

    this.#div.innerHTML = `<div  style="${this.#css2}">
                        <div>
                            <h1>
                                ${text?.title||""}
                            </h1>
                            <p>${text?.contenido||""}</p>
                        </div>
                        <div>
                            ${aux}
                        </div>
                    </div>`
    document.body.append(this.#div)


    }
    /**
     * Genera un prompt
     * @param text { title:String|HTML, placeholder:String}.
     * @param opction Configuracion de botones Ejem. [
     * { name: "Aceptar", -> Nombre del Boton
     *  onclick:()=>{}, -> Accion a Realizar despues del Click
     *  type: 1 -> tipo de Boton [1,2,3,4,5]
     *  }]
     */
    static prompt(text = { title: "", placeholder: "" },opction = [{ name: "Aceptar", onclick:()=>{}, type: 1 }]) {
        this.#opction=opction
        this.#div.id="ALERTMODAL"
        this.#div.setAttribute("style", this.#css)
        let aux = ""
        opction.map(op =>{
            let temp=`<button 

            onclick="Alert.close('${op.name}')"
            style="padding: .5rem;
            border: none;
            background: ${this.#cssColors[op.type - 1]}
            color: white;
            border-radius: 5px;
            margin: 1rem;
            cursor:pointer;
        "
        >${op.name}</button>`
        aux +=temp
    })

    this.#div.innerHTML = `<div  style="${this.#css2}">
                        <div>
                            <h1>
                                ${text?.title||""}
                            </h1>
                            <p><input style="width: 100%;height: 35px;font-size: 1.1rem;" type="text" id="PROMPTALERT" placeholder="${text?.placeholder||""}"></p>
                        </div>
                        <div>
                            ${aux}
                        </div>
                    </div>`
    document.body.append(this.#div)
    }
    static close(e) {
       try{
        this.#opction.filter(op=>op.name==e)[0].onclick()
       }catch(e){
        console.error("onclick is undefined")
       }
        document.querySelector("#ALERTMODAL").remove()
    }
}
