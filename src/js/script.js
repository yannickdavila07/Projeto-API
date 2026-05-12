// DELCARACOES DOS ELEMENTOS USANDO DOM
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");


//FUNCAO QUE HABILITA A CAMERA

async function configurarCamera() {
    try{
        const media = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, //aciona a camera traseira
            audio: false

        });
        //recebe a funcao midi para habilitar a camera
        videoElemento.srcObject = media;
        //garante que o video comece
        videoElemento.play();

    }catch(erro){
        resultado.innerText = "Erro ao acessar a câmera";
    }
    
}

//executa a funcao da camera
configurarCamera();


//funcao para let o texto que a  camera pegar

botaoScanear.onclick = async () =>{
    botaoScanear.disable=true; //habilita a camera
    resultado.innerText = "Fazendo a leitura... aguarde";

    //preparando o canvas para criar estrutura da câmera
    const contexto = canvas.getContext("2d");

    //ajustar o tamanho do canvas
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //reset para garantir que a foto nao saia invertida
    contexto.setTransform(1,0,0,1,0,0)

    //filtro de contraste e escala de cinza antes de tirar a foto
    //ajuda a evitar as letraas aleatorias

    contexto.filter = 'contrast(1.2) grayscale(1)';

    try{
        
        
        const { data: { text }} = await Tesseract.recognize(
            canvas, //aonde o texto vai aparecer
            'por' //idioma do texto
        )

        //Remove espacos excessivos e caracteres especiais

        const textoFinal = text.trim()
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível indentificar o texto"

    }catch(erro){
        console.error(erro);
        resultado.innerText = "Erro ao processar", erro
    }
    finally{
        //desabilita a camera para fazer uma nova captura
        botaoScanear.disable = false;

    }
}