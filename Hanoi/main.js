// Alert.alert(
//     {contenido: "hola"},
//     [{
//         name:"clear",
//         type: 3,
//         onclick: ()=>{}
//     },{
//         name:"casd",
//         type: 1,
//         onclick: ()=>{
//             document.querySelector("#"+i).remove()
//             let obj= T.dataJson[i.split("-")[i]]
//             db.remove("productos",parseInt(obj["id"]))
//             loadTable()
//         }
//     }]
// )

// if(screen.orientation.type!="landscape-primary"){
//     Alert.alert({contenido: "rote de pantalla"});
//     location.reload();
// }

let canvas=new Canvas()

// window.screen.lockOrientation("landscape-primary");
canvas.fill()
canvas.getCanvas().css({"background" : "#2d2d2d"})
if(canvas.width<canvas.height){
    Alert.alert({contenido: "rote la pantalla para una mejor experiencia"});
}
// function pintarFiguras(i,n){
//     if(i==n+1) return;
//     let radio= 200;
//     let x= canvas.width/2;
//     let y= canvas.height/2;
//     canvas.polygon(x,y,i,radio,undefined,"rgb(6 133 243)");
//     setTimeout(()=>pintarFiguras(i+1,n),1e2);
// }
// pintarFiguras(2,30);

// console.log("0");
// setTimeout(() => {
//     console.log("1");
//     setTimeout(() => {
//         console.log("2");
//     }, 1e2);
//     console.log("3");
// }, 1e2);
// console.log("4");
const margenX= 100, margenY= 60;
const X= margenX/2;
const Y= margenY/2;

const ANCHO= canvas.width-margenX;
const LARGO= canvas.height-margenY;
let N= 2;

let margenTop= LARGO/4.5, largoPalo= LARGO-margenTop;

let DISMINUCIONX, DISMINUCIONY;
function calcularMedidas(N) {
    DISMINUCIONX= (ANCHO/4/N)/2;
    DISMINUCIONY= (largoPalo-largoPalo/5)/N;
    if(DISMINUCIONY > ANCHO/4 - 2*(N-1)*DISMINUCIONX*1.2){
        DISMINUCIONY= DISMINUCIONX*1.6;
        largoPalo= DISMINUCIONY*N + DISMINUCIONY;
        margenTop= LARGO-largoPalo
    }else{
        margenTop= LARGO/4.5
        largoPalo= LARGO-margenTop
    }
}
calcularMedidas(N)

class Palo{
    constructor(i){
        this.id= i;
        this.x= X + (i+1)*ANCHO/4;
        this.y= Y+LARGO;
        this.ancho= ANCHO/4 + 4;
        this.largo= largoPalo;
        this.discos= [];
        this.select= false;
        this.paloInicial= false;
        if(i==0) this.paloInicial= true;
    }
    pintarSelect(){
        if(this.select) canvas.rect(X+ANCHO/8 - 2 + this.id*ANCHO/4, Y, this.ancho, LARGO, "rgba(0,255,255,0.3)",1,5);
       // else canvas.rect(this.x, this.y, this.ancho, this.largo, "rgba(0,102,255,0.3)",1,5);
    }
    pintar(){
        if(this.paloInicial) canvas.rect(this.x-5,this.y,10,-largoPalo,"red",true)
        else canvas.rect(this.x-5,this.y,10,-largoPalo,"white",true)
    }
    posX(){
        return X+ANCHO/8 + this.id*ANCHO/4 + 5 + this.id*DISMINUCIONX;
    }
    pintarDiscos(){
        for (let j= 0; j<this.discos.length; j++){
            this.discos[j].x= X+ANCHO/4+this.id*ANCHO/4 - this.discos[j].ancho/2;
            if(this.select && j==this.discos.length-1) this.discos[j].y= Y+LARGO-DISMINUCIONY - j*DISMINUCIONY - DISMINUCIONY/10; 
            else this.discos[j].y= Y+LARGO-DISMINUCIONY - j*DISMINUCIONY;
            this.discos[j].pintar();
        }
    }
}

class Disco{
    constructor(i){
        this.id=i
        this.x= X+ANCHO/8 + 5 + i*DISMINUCIONX;
        this.ancho= ANCHO/4 - 2*i*DISMINUCIONX;
        this.y= Y+LARGO-DISMINUCIONY - i*DISMINUCIONY;
        this.largo= DISMINUCIONY;
        this.c= "rgb("+Random(1,255)+","+Random(1,255)+","+Random(1,255)+")";
    }
    pintar() {
        canvas.rect(this.x,this.y,this.ancho,this.largo,this.c,1,this.largo/2);
        canvas.rect(this.x,this.y,this.ancho,this.largo,"black",0,this.largo/2);
    }
}

let palos= [new Palo(0), new Palo(1), new Palo(2)]
let movimientos= 0;

let fondos=["/sonidos/fondo/Acepta.mp3","/sonidos/fondo/inundanos.mp3","/sonidos/fondo/TanjiroNoUta.mp3","/sonidos/fondo/Yeshua.mp3"];
let soniJuego= "/sonidos/juego/burbuja.mp3";
let soniEquivocacion= "/sonidos/juego/pajarito.mp3";
let winer= ["/sonidos/winer/classOfClans.mp3","/sonidos/winer/estelas.mp3","/sonidos/winer/niño.mp3"];
let torreen= 0;

function crearDiscos(N, torreen) {
    for (let i = 0; i < N; i++) palos[torreen].discos.push(new Disco(i));
}
crearDiscos(N, torreen);
let sonidoFondo="";

pintarTodo();
let tiempoInicio= Date.now(), tiempoFin;
function minutosSegundos(tiempoInicio, tiempoFin) {
    let tiempo= (tiempoFin-tiempoInicio)/1000;
    // console.log(tiempoInicio, tiempoFin, tiempo);
    let min= parseInt(tiempo/60);
    let sec= parseInt(tiempo%60);
    return min+"min : "+sec+"seg";
}

let select1=-1;
canvas.event("click",click)
canvas.event("ontouchstart",click)

function click(e){
    if(sonidoFondo=="" || sonidoFondo.ended==true){
        sonidoFondo = new Audio(fondos[Random(0,4)]);
        sonidoFondo.play();
    }
    let {x,y}= canvas.getMousePosition(e);

    if(x>X && x<X+ANCHO/20 && y>Y && y<Y+ANCHO/20 ){
        if(torreen==0) resolverHanoi(N, torreen, 2);
        else  resolverHanoi(N, torreen, 0);
    }

    let a= paloSeleccionado(x,y); 
    if(select1==-1 && a!=-1 && palos[a].discos.length>0){
        select1= a;
        palos[a].select= true;
        pintarTodo();
    }else if(a!=-1 && select1!=-1 && (palos[a].discos.length==0 || palos[select1].discos[palos[select1].discos.length-1].ancho<=palos[a].discos[palos[a].discos.length-1].ancho)){
        if(palos[select1].discos.length>0){
            palos[a].discos.push(palos[select1].discos.pop())
        }
        palos[select1].select= false;
        if(a!=select1){
            (new Audio(soniJuego)).play();
            movimientos++;
        }
        else{
            (new Audio(soniEquivocacion)).play();
        }
        select1= -1;
        pintarTodo();
        for(let i=0; i<3; i++) if(palos[i].discos.length==N && i!=torreen){
            (new Audio(winer[Random(0,3)])).play()
            tiempoFin= Date.now();
            Alert.alert({
                title: "CONGRATULATIONS", 
                contenido: "Has ganado <br>" 
                    +"Movimientos: "+movimientos+"<br>"
                    +"Tiempo: "+minutosSegundos(tiempoInicio,tiempoFin) },
                [{
                    name: "Siguiente nivel",
                    type: 1,
                    onclick: () => {
                        movimientos= 0;
                        palos[torreen].paloInicial = false;
                        torreen= i;  
                        palos[torreen].paloInicial = true;
                        for(let j=0; j<3; j++) palos[j].discos= []
                        N++;
                        calcularMedidas(N)
                        crearDiscos(N, torreen);
                        tiempoInicio= tiempoFin;
                        pintarTodo();
                    }
                }])
        }
    }
}
canvas.event("mousemove",move)
canvas.event("ontouchmove",move)
function move(e){
    let {x,y}= canvas.getMousePosition(e);
    pintarTodo(paloSeleccionado(x,y));
}

function paloSeleccionado(x,y){
    for(let i=0; i<3; i++){
        if(x > palos[i].x-ANCHO/8 && x < palos[i].x + ANCHO/8 && y > Y && y < Y+LARGO){
            canvas.getCanvas().css({"cursor": "pointer"});
            return i;
        }
    }
    canvas.getCanvas().css({"cursor": "auto"});
    return -1;
}

function pintarTodo(aux=-1){
    canvas.clear();
    canvas.rect(X,Y,ANCHO,LARGO,"white");
    canvas.text("movimientos: " + movimientos, ANCHO/2-10, Y-3, 23, "white");
    
    if(aux>=0) canvas.rect(X+ANCHO/8 - 2 + aux*ANCHO/4, Y, ANCHO/4+4, LARGO, "rgba(0,102,255,0.3)",1,5);
    for (let i = 0; i < 3; i++){
        palos[i].pintar();
        palos[i].pintarSelect();
    }

    for (let i = 0; i < 3; i++) palos[i].pintarDiscos();
}

let f=0;
function loop(){
    canvas.polygonPerLine(X+ANCHO/40,Y+ANCHO/40,f,ANCHO/40,0,"aqua")
    canvas.polygonPerLine(X+ANCHO/40,Y+ANCHO/40,f,ANCHO/40,180,"aqua")
    canvas.polygonPerLine(X+ANCHO/40,Y+ANCHO/40,f,ANCHO/40,270,"aqua")
    canvas.polygonPerLine(X+ANCHO/40,Y+ANCHO/40,f,ANCHO/40,360,"aqua")
    // canvas.polygonPerLine(x+X+ANCHO/40,Y+ANCHO/20,f,ANCHO/20,undefined,"aqua")
    if(f==7) f=1;
    f++;
}
setInterval(loop,100);

function Nid(id) {
    return N-id;
}
let paso;
function resolverHanoi(N, torre, va, aux=3-torre-va){
    if(palos[torre].discos.length==N){
        canvas.removeEvent("click",click)
        canvas.removeEvent("ontouchstart",click)
        paso=0;
        recursividadHanoi(N, paloDelDisco(torre), paloDelDisco(va), paloDelDisco(aux))
        setTimeout(() =>{
            canvas.event("click",click)
            canvas.event("ontouchstart",click)
        },1e3/1.5*(2**N-1))
    }
}
function fhanoi(N, torre, va, aux=3-torre-va){
    if(palos[torre].discos.length==N){
        canvas.removeEvent("click",click)
        canvas.removeEvent("ontouchstart",click)
        paso=0;
        recursividadHanoi(N, paloDelDisco(torre), paloDelDisco(va), paloDelDisco(aux))
        canvas.event("click",click)
        canvas.event("ontouchstart",click)
    }
}
function recursividadHanoi(n, origen, destino, aux){
    if(n>0){
        // console.log("antes", id, va, aux);
        recursividadHanoi(n-1, origen, aux, destino)
        if(n-1!=0) paso++;
        // console.log("desp", n, va, aux);

        setTimeout(()=>{
            destino.discos.push(origen.discos.pop());
            movimientos++;
            (new Audio(soniJuego)).play();
            pintarTodo()}, 1e3/1.5*paso);

        if(n-1!=0) paso++;
        recursividadHanoi(n-1, aux, destino, origen)
        
    }
}
function paloDelDisco(id){
    for (let i = 0; i < 3; i++) if(i==id) return palos[i];
}
//automatico recursivo
// function recursividadHanoi(id, nova, va) {
//     if(id == N) return;
//     let sum=0;
//     if((N-min)%2==0) sum=1; //2-0 sum= 0,
//     if(id<N) {
//         console.log(id, nova, va, sum);
//         if((id+sum)%2!=0){ //0+1 imp, 1+1 p
//             console.log("a");
//             resolverHanoi(id+1, nova, va);
//         }
//         else{
//             console.log("b");
//             resolverHanoi(id+1, va, nova);
//         }
//     }
//     if((id+sum)%2==0) {
//         console.log("a",id,"p"+paloDelDisco(id), "va:"+va);
//         palos[va].discos.push(palos[paloDelDisco(id)].discos.pop());
//     }
//     else{
//         console.log("b",id,"p"+paloDelDisco(id), "va:"+nova);
//         palos[nova].discos.push(palos[paloDelDisco(id)].discos.pop());
//     }

//     resolverHanoi(id+1, 3-paloDelDisco(id+1)-paloDelDisco(id), paloDelDisco(id), id+1);
// }
// function f(id, nova, va){//N=2 id=0, nova= 1, va=2=0
//     if(id == N) return;
//     let sum=0;
//     if((N-min)%2==0) sum=1; //2-0 sum= 0,
//     if(id<N) {
//         console.log(id, nova, va, sum);
//         if((id+sum)%2!=0){ //0+1 imp, 1+1 p
//             console.log("a");
//             f(id+1, nova, va);
//         }
//         else{
//             console.log("b");
//             f(id+1, va, nova);
//         }
//     }
//     if((id+sum)%2==0) console.log("a",id,"p"+paloDelDisco(id), "va:"+va);
//     else console.log("b",id,"p"+paloDelDisco(id), "va:"+nova);

//     f(id+1, 3-paloDelDisco(id+1)-paloDelDisco(id), paloDelDisco(id), id+1);
// }
// 
// function inicio(nova, va) {
//     return 3-nova-va;
// }
// let dePalo= 1-1, aPalo= 3-1, paloAux=2-1;

// if( palos[0].discos.length%2==0) resolverHanoi(0, 1, 2);
// else resolverHanoi(0, 2, 1)