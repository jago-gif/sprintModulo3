//se inicializa variable tCargas como false (esta variable se utiliza para habilitar el campo cantCargas cuando se palomea el checkbox tieneCarga)
let tCargas = false;
const fecha = new Date
//inicializa trabajador con 2 key y value
trabajador = {
  trabajadorActivo : false,
  tieneCarga : false,
}
let mensaje;
let mensaje1;
let alerta;
//Seleccionar el formulario
const form = document.getElementById('formulario');

//constantes de tramos con los valores correspondientes
const tramoA = 429899;
const tramoB = 627913;
const tramoC = 979330;

//crea sin inicializar la variable sueldoFinal
let sueldoFinal;


//Agregar listener para el evento submit
form.addEventListener('submit', function (event) {
  //se detiene el recargar del evento submint
  event.preventDefault();
  cargarTrabajador();

  

  //Verificar si el formulario es válido
  if (!form.checkValidity()) {
  if((trabajador.nombre===""||trabajador.nombre===null||trabajador.nombre===undefined)||
  (trabajador.apellido===""||trabajador.apellido===null||trabajador.apellido===undefined)||
  (trabajador.fechaNacimiento===""||trabajador.fechaNacimiento===null||trabajador.fechaNacimiento===undefined)||
  (trabajador.fechaEntrada===""||trabajador.fechaEntrada===null||trabajador.fechaEntrada===undefined)||
  (trabajador.sueldoActual===""||trabajador.sueldoActual===null||trabajador.sueldoActual===undefined)||
  (trabajador.sueldoAnterior===""||trabajador.sueldoAnterior===null||trabajador.sueldoAnterior===undefined)){
    Swal.fire({
      icon: 'error',
      title: 'Campo incompleto',
      text: 'Debe completar todos los campos',
    }) 
  }
    //Agregar clase CSS de Bootstrap al formulario para mostrar los campos faltantes en la validación
  form.classList.add('was-validated');
  }else{
    
  let fnac = new Date(trabajador.fechaNacimiento);
  let fent = new Date(trabajador.fechaEntrada);

  if(fecha>fent){
    Swal.fire({
      icon: 'error',
      title: 'Error Fecha',
      text: 'La fecha de ingreso a la empresa no debe ser superior a la fecha actual',
    }) 
    return
  }

  if(fecha>fnac){
    Swal.fire({
      icon: 'error',
      title: 'Error Fecha',
      text: 'La fecha de nacimiento no debe ser superior a la fecha actual',
    }) 
    return
  }
    //se inicia el punto B del spring
    pertenenciaEmpresa(trabajador);
    
    //se inicia el punto C del spring
    calcularCargas(trabajador);
    
    //se inicia el punto D del spring
    entregaFull(trabajador);

    mensajesweet1();

  }
  
});


//constante que contiene el llamado al input con id tieneCarga
const constCantCargas = document.getElementById('cantCargas');
//funcion llamada desde el checkbox 
function habilitarCarga() {
//valida si tieneCarga está como falsa
  if (trabajador.tieneCarga == false) {
    //pasa tieneCarga a true
    trabajador.tieneCarga = true;
    //deja el input cantCarga con disabled falso habilitandolo
    constCantCargas.disabled = false;
    //deja el input cantCarga con required verdadero dejandolo como requerido para la validación
    constCantCargas.required = true;
  } else {
      //pasa tieneCarga a true
      trabajador.tieneCarga = false;
    //deja el input cantCarga con disabled verdadero deshabilitandolo
    constCantCargas.disabled = true;
    //deja el input cantCarga con required falso dejandolo como no requerido para la validación
    constCantCargas.required = false;
  }
}

function checkTrabajadorActivo() {
  //valida si trabajadorActivo está como falsa
    if (trabajador.trabajadorActivo == false) {
      //pasa trabajadorActivo a true
      trabajador.trabajadorActivo = true;
    } else {
        //pasa trabajadorActivo a true
        trabajador.trabajadorActivo = false;
     
    }
  }
//variable que contiene la funcion B del spring
let pertenenciaEmpresa = ()=>{
  const fechaActual = new Date();
  const fechaIngresada = new Date(trabajador.fechaEntrada);
  const diaMiliseg = 86400000;
  const anoMiliseg = 31557600000;
  const mesMiliseg = 2630016000;
  
  // Calcula los milisegundos transcurridos entre las fechas
  const milisegundosTranscurridos = fechaActual.getTime() - fechaIngresada.getTime();
  
  // Convierte los milisegundos en días y meses transcurridos
  const diasTranscurridos = Math.floor(milisegundosTranscurridos / (diaMiliseg));
  const mesesTranscurridos = Math.floor(diasTranscurridos / 30.44); // Promedio de días por mes
  //calculo para sacar dif en los datos individuales para hacer el calculo general
  let diferencia = milisegundosTranscurridos;
  const anosGral= Math.floor(diferencia / (anoMiliseg)); // Promedio de días por año
  if(anosGral>0){
    diferencia = diferencia - Math.floor(anosGral*anoMiliseg);
  }
  const mesesGral = Math.floor(diferencia /(mesMiliseg));
  if(mesesGral>0){
    diferencia = diferencia - Math.floor(mesesGral * (mesMiliseg));
  }
  const diasGral = Math.floor(diferencia / (diaMiliseg));
  //se crea fecha ingreso modificada al año actual.
  let fIngAnAct= new Date(fechaActual.getFullYear(),fechaIngresada.getMonth(), fechaIngresada.getDay()) 
  //creamos variable fechafinano que contiene la fecha donde se cumple el año labolar
  let fechaFinAnio;
  // se valida si fIngAnAct es menor a la fecha de hoy
  if(fIngAnAct.getTime()>fechaActual.getTime()){
    //si es menor se utiliza el año actual para la fecha de cumplimiento de un año laboral
     fechaFinAnio = new Date(fIngAnAct.getFullYear(), fechaIngresada.getMonth(), fechaIngresada.getDay()); // Fecha de fin de año
  }else{
    //sino se le agrega un año al año de cumplimiento labolar
     fechaFinAnio = new Date(fIngAnAct.getFullYear()+1, fechaIngresada.getMonth(), fechaIngresada.getDay()); // Fecha de fin de año
  }
  //se pasa la fecha a milisegundos
  const milisegundosRestantesAnio = fechaFinAnio.getTime() - fechaActual.getTime();
  //se calculan cuantos días faltan
  const diasRestantesAnio = Math.ceil(milisegundosRestantesAnio / (diaMiliseg));
  
  //llamada de alerta con la información 
   alerta = 
  "Su permanencia en la organización es de "+diasTranscurridos+" días"+ 
  "<br>Su permanencia en la organización es de "+mesesTranscurridos+" meses"+ 
  "<br>Su permanencia en la organización es de "+ anosGral+" años y "+mesesGral+" meses y "+diasGral+" días "
  "<br>Para completar el año de permanencia faltan: "+diasRestantesAnio

  return alerta;
} 
//variable que contiene la funcion C del spring
let calcularCargas = ()=>{
  //crea y inicializa con valor 0 la variable valorCarga
  let valorCarga = 0;
  //valida si el sueldo actual es menor o igual al tramo A
  if (trabajador.sueldoActual <= tramoA) {
    //asigna el valor por carga familiar
    valorCarga = 16828;
  }
  //valida si el sueldo actual es menor o igual al tramo B
  if (trabajador.sueldoActual > tramoA && sueldoActual <= tramoB) {
    //asigna el valor por carga familiar  
    valorCarga = 10327;
  }
  //valida si el sueldo actual es menor o igual al tramo C
  if (trabajador.sueldoActual > tramoB && sueldoActual <= tramoC) {
    //asigna el valor por carga familiar  
    valorCarga = 3264;
  }
  //valida si el trabajador tiene cargas como verdadero
  if (trabajador.tieneCarga == true) {
    //si tiene cargas familiares se mutiplica el valor de la carga por el numero de cargas y se le suma el sueldoActual
    sueldoFinal = (valorCarga * trabajador.cantCargas) + trabajador.sueldoActual
  } else {
    //si no tiene cargas familiares el sueldo final es el valor del sueldo actual
    sueldoFinal = trabajador.sueldoActual
  }
  //se agregan los valores de sueldoFinal y valorCarga al objeto trabajador
  trabajador.sueldoFinal = sueldoFinal;
  trabajador.valorCarga = valorCarga;
  mensaje1 = "Sr/a " + trabajador.nombre + " " + trabajador.apellido + "<br> Su sueldo actual es de $" + trabajador.sueldoActual + " <br>Y el valor por carga familiar es de $" 
  + valorCarga + " <br>Y su sueldo final es de $" + sueldoFinal
 return mensaje1;
}
//variable que contiene la funcion D del spring
let entregaFull = () =>{
  if(trabajador.trabajadorActivo){
    trabajador.trabajadorActivo = "SI"
  }else{
    trabajador.trabajadorActivo = "NO"

  }
  if(trabajador.tieneCarga){
    trabajador.tieneCarga = "SI"
  }else{
    trabajador.tieneCarga = "NO"
  }
  if(trabajador.cantCargas===""||isNaN(trabajador.cantCargas)){
    trabajador.cantCargas = 0;
  }
    //llamada de alerta con la información 
    mensaje = 
    "Nombre :"+ trabajador.nombre+
    "<br>Apellido :"+ trabajador.apellido+
    "<br>Fecha de nacimiento :"+ trabajador.fechaNacimiento +
    "<br>Trabajador activo :"+ trabajador.trabajadorActivo+
    "<br>Fecha de entrada :" +trabajador.fechaEntrada+
    "<br>Sueldo actual :$"+ trabajador.sueldoActual+
    "<br>Sueldo trimestre anterior :$" +trabajador.sueldoAnterior+
    "<br>Tiene cargas familiares :"+ trabajador.tieneCarga+
    "<br>Cantidad de cargas familiares:"+ trabajador.cantCargas+
    "<br>Monto de carga familiar :$"+ trabajador.valorCarga+
    "<br>Sueldo final :$" +trabajador.sueldoFinal
  return mensaje
}

let cargarTrabajador=()=>{
  //se agregan al objeto trabajador los datos del formulario y conserva los valores key y value ya establecidos anteriormente
 trabajador = {
  nombre : document.getElementById('nombre').value,
  apellido : document.getElementById('apellido').value,
  fechaNacimiento : document.getElementById('fechaNacimiento').value,
  trabajadorActivo : trabajador.trabajadorActivo,
  fechaEntrada : document.getElementById('fechaEntrada').value,
  sueldoActual : parseInt(document.getElementById('sueldoActual').value),
  sueldoAnterior : parseInt(document.getElementById('sueldoAnterior').value),
  tieneCarga : trabajador.tieneCarga,
  cantCargas : parseInt(document.getElementById('cantCargas').value),
}
return(trabajador)
}

function mensajesweet1(){
  Swal.fire({
    title:'Pertenencia a la empresa',
    html:alerta,
    showCloseButton: true,
    didClose: () => {
      // Muestra otra alerta al cerrar la anterior
      mensajesweet2();
    }

  })
}
function mensajesweet2(){
  Swal.fire({
    title:'Datos carga familiar Trabajador',
    html:mensaje1,
    showCloseButton: true,
    didClose: () => {
      // Muestra otra alerta al cerrar la anterior
      mensajesweet3();
    }

  })
}
function mensajesweet3(){
  Swal.fire({
    title:'Datos del trabajador',
  html:mensaje,
  showCloseButton: true
  })
}

