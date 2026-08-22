console.log('Flappy Bird');

let frames = 0;

const Som_HIT = new Audio();
Som_HIT.src = './Efeitos/efeitos_hit.wav';

const musicfund = new Audio();
musicfund.src = './musc_fundo/fazsol.mp3';

const sprites = new Image();
sprites.src = 'img/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

function CriaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const MovimentoDoChao = 1;
            const RepeteEm = chao.largura / 2;
            const movimentacao = chao.x - MovimentoDoChao;
            chao.x = movimentacao % RepeteEm

        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };
    return chao;
}


function fazcolisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

function CriaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 26,
        x: 10,
        y: 50,
        pulo: 4.5,
        pula() {
            console.log('devo pular');
            flappyBird.velocidade = - flappyBird.pulo
        },
        gravidade: 0.23,
        velocidade: 0,
        atualiza() {
            if (fazcolisao(flappyBird, Globais.chao)) {
                console.log('faz colisão');
                Som_HIT.play();
                
                    mudaParaTela(Telas.Game_over);
                

                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, //frame asa cima 
            { spriteX: 0, spriteY: 26, }, // frame asa meio
            { spriteX: 0, spriteY: 52, }, // frame asa baixo 
        ],
        FrameAtual: 0,
        AtualizaFrameAtual() {
            const IntervaloDeFrames = 10;
            const PassouOIntervalo = frames % IntervaloDeFrames === 0;
            if (PassouOIntervalo) {
                const BaseDoIncremento = 1;
                const Incremento = BaseDoIncremento + flappyBird.FrameAtual;
                const BaseRepeticao = flappyBird.movimentos.length;
                flappyBird.FrameAtual = Incremento % BaseRepeticao;
            }

        },

        desenha() {
            flappyBird.AtualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.FrameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}

/// [mensagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}

const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h
        );
    }
}

function CriaCanos() {
    const cano = {
        largura: 53,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {

            cano.pares.forEach(function (par) {
                const yRandom = par.y;
                const espacamentoentreoscanos = 90;

                // cano céu
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                contexto.drawImage(
                    sprites,
                    cano.ceu.spriteX, cano.ceu.spriteY,
                    cano.largura, cano.altura,
                    canoCeuX, canoCeuY,
                    cano.largura, cano.altura,
                )
                // cano chão 
                const canoChaoX = par.x;
                const canoChaoY = cano.altura + espacamentoentreoscanos + yRandom;
                contexto.drawImage(
                    sprites,
                    cano.chao.spriteX, cano.chao.spriteY,
                    cano.largura, cano.altura,
                    canoChaoX, canoChaoY,
                    cano.largura, cano.altura
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: cano.altura + canoCeuY,
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            })
        },

        TemColisaoComOPersonagem(par) {
            const Headflappy = Globais.flappyBird.y;
            const FootFlappy = Globais.flappyBird.y + Globais.flappyBird.altura;


            if ((Globais.flappyBird.x + Globais.flappyBird.largura) >= par.x) {
                console.log('colisão com a area do cano')

                if (Headflappy <= par.canoCeu.y) {
                    return true;
                }

                if (FootFlappy >= par.canoChao.y) {
                    return true;
                }

            }




            return false;

        },

        pares: [],
        atualiza() {
            const Passou100frames = frames % 100 === 0;
            if (Passou100frames) {
                console.log('passou de 100 frames');
                cano.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            cano.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (cano.TemColisaoComOPersonagem(par)) {
                    console.log('morreu!');
                    Som_HIT.play();
                    mudaParaTela(Telas.Game_over);
                }

                if (par.x + cano.largura <= 0) {
                    cano.pares.shift();
                }
            })

        }
    }
    return cano;
}


function CriaPlacar() {
    const placar = {
        Pontuacao: 0,
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.Pontuacao}`, canvas.width - 10, 35);
            
        },
        atualiza() {
            const IntervaloDeFrames = 20;
            const PassouOIntervalo = frames % IntervaloDeFrames === 0;
            if (PassouOIntervalo) {
                placar.Pontuacao = placar.Pontuacao + 1;
            }
            
        },
    }
    return placar;
}


window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') { // Verifica se a tecla pressionada é a barra de espaço
        if (telaAtiva.click) {
            telaAtiva.click(); // Aplica a ação no click 
        }
    }
});

// Telas
const Globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }

}

const Telas = {
    INICIO: {
        inicializa() {
            Globais.flappyBird = CriaFlappyBird();
            Globais.chao = CriaChao();
            Globais.cano = CriaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            Globais.flappyBird.desenha();
            Globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            Globais.chao.atualiza();
        }

    }
};

Telas.JOGO = {
    inicializa() {
        Globais.placar = CriaPlacar();
    },
    desenha() {
        planoDeFundo.desenha();
        Globais.cano.desenha();
        Globais.flappyBird.desenha();
        Globais.chao.desenha();
        Globais.placar.desenha();
    },
    click() {
        Globais.flappyBird.pula();
        musicfund.play();
    },
    atualiza() {
        Globais.cano.atualiza();
        Globais.chao.atualiza();
        Globais.flappyBird.atualiza();
        Globais.placar.atualiza();
    }
};

Telas.Game_over = {
    desenha() {
        mensagemGameOver.desenha();
    },
    click() {
        mudaParaTela(Telas.INICIO);
    
    },
    atualiza() {
       
    }

};

// Mantém o jogo sempre na mesma velocidade (60 "ticks" por segundo),
// independente da taxa de atualização da tela do dispositivo (60Hz, 90Hz, 120Hz...).
// Sem isso, em telas mais rápidas o requestAnimationFrame dispara mais vezes
// por segundo e o jogo fica mais rápido / injogável.
const FPS_ALVO = 60;
const DURACAO_DO_FRAME = 1000 / FPS_ALVO;
let ultimoTempo = 0;
let acumulador = 0;

function loop(tempoAtual) {
    if (!ultimoTempo) ultimoTempo = tempoAtual;

    let delta = tempoAtual - ultimoTempo;
    ultimoTempo = tempoAtual;

    // evita um "salto" gigante de física quando a aba fica em segundo plano
    if (delta > 250) delta = DURACAO_DO_FRAME;

    acumulador += delta;

    while (acumulador >= DURACAO_DO_FRAME) {
        telaAtiva.atualiza();
        frames = frames + 1;
        acumulador -= DURACAO_DO_FRAME;
    }

    telaAtiva.desenha();

    requestAnimationFrame(loop);
}

// Pular só deve acontecer com clique/toque dentro do jogo —
// não em qualquer clique da página (menu, botões, formulário etc.)
canvas.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
requestAnimationFrame(loop);