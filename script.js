// Constantes
const METAS = {
    "Treinando": {"vendas": 4000, "vidas": 10},
    "Consultor": {"vendas": 10000, "vidas": 25},
    "Corretor": {"vendas": 15000, "vidas": 40},
    "Especialista": {"vendas": 20000, "vidas": 60},
    "Representante": {"vendas": 30000, "vidas": 100},
};

const PERIODOS = {"Mensal": 1, "Trimestral": 3, "Semestral": 6};
const CATEGORIAS = ["Treinando", "Consultor", "Corretor", "Especialista", "Representante"];

// Elementos da página
const btnCalcular = document.getElementById('calcular');
const loadingOverlay = document.getElementById('loading-overlay');
const resultadoContent = document.getElementById('resultado-content');
const semGrafico = document.getElementById('sem-grafico');
const chartsContainer = document.getElementById('charts-container');

// Gráficos
let vendasChart = null;
let vidasChart = null;
let radarChart = null;

// Função para limpar campo quando ocorrer erro
function limparErro() {
    // Verifica se há mensagem de erro
    if (resultadoContent && resultadoContent.querySelector('.error-message')) {
        // Restaura mensagem padrão
        resultadoContent.innerHTML = '<p class="info-text">Complete o formulário e clique em Calcular para ver os resultados</p>';
    }
}

// Adiciona eventos de mudança aos campos
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', limparErro);
    input.addEventListener('input', limparErro);
});

// Função para formatar valor monetário
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(valor);
}

// Função para limpar e converter string para número
function limparEConverterNumero(valor) {
    if (!valor || valor.toString().trim() === '') return NaN;
    
    // Remove qualquer caractere que não seja dígito, ponto ou vírgula
    let valorLimpo = valor.toString().replace(/[^\d,.]/g, '');
    
    // Substitui vírgula por ponto (padrão para números em JavaScript)
    valorLimpo = valorLimpo.replace(/,/g, '.');
    
    // Se houver mais de um ponto, mantém apenas o último (caso tenha separador de milhar)
    const pontos = valorLimpo.match(/\./g);
    if (pontos && pontos.length > 1) {
        const partes = valorLimpo.split('.');
        const ultimaParte = partes.pop();
        valorLimpo = partes.join('') + '.' + ultimaParte;
    }
    
    return parseFloat(valorLimpo);
}

// Função para criar um indicador visual
function criarIndicador(label, valor, icone, porcentagem = null) {
    const indicador = document.createElement('div');
    indicador.className = 'indicator';
    
    // Define a cor e classe de fundo com base na porcentagem
    let classeCorBg = '';
    let classeCorTexto = '';
    
    if (porcentagem !== null) {
        if (porcentagem >= 90) {
            classeCorBg = 'success-bg';
            classeCorTexto = 'text-success';
        } else if (porcentagem < 70) {
            classeCorBg = 'alert-bg';
            classeCorTexto = 'text-alert';
        } else {
            classeCorBg = 'neutral-bg';
            classeCorTexto = 'text-secondary';
        }
    }
    
    // Adicionar classe de fundo somente se não estiver vazia
    if (classeCorBg) {
        indicador.classList.add(classeCorBg);
    }
    
    // Conteúdo do indicador
    indicador.innerHTML = `
        <span class="icon ${classeCorTexto || ''}"><i class="${icone}"></i></span>
        <span class="indicator-text">${label}: </span>
        <span class="indicator-value ${classeCorTexto || ''}">
            ${valor}
        </span>
    `;
    
    return indicador;
}

// Função para calcular resultados
function calcularResultados() {
    try {
        console.log("Função calcularResultados iniciada");
        
        // Mostrar overlay de carregamento
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Verificar se os selects foram selecionados
        const categoria = document.getElementById('categoria').value;
        const periodo = document.getElementById('periodo').value;
        
        console.log("Valores iniciais:", { categoria, periodo });
        
        if (!categoria || !periodo) {
            throw new Error("Selecione a categoria e o período");
        }
        
        // Obter valores dos campos
        const vendasValor = document.getElementById('vendas').value;
        const adesaoValor = document.getElementById('adesao').value;
        const vidasValor = document.getElementById('vidas').value;
        const adimplenciaValor = document.getElementById('adimplencia').value;
        
        console.log("Valores dos campos:", {
            vendas: vendasValor,
            adesao: adesaoValor,
            vidas: vidasValor,
            adimplencia: adimplenciaValor
        });
        
        // Verificar se todos os campos foram preenchidos
        if (!vendasValor || !adesaoValor || !vidasValor || !adimplenciaValor) {
            throw new Error("Todos os campos devem ser preenchidos");
        }
        
        // Converter valores para números com validação melhorada
        const vend = limparEConverterNumero(vendasValor);
        const ades = limparEConverterNumero(adesaoValor);
        const vid = Math.round(limparEConverterNumero(vidasValor)); // Arredonda para inteiro
        const adim = limparEConverterNumero(adimplenciaValor);
        
        console.log("Valores convertidos:", {
            vendas: vend,
            adesao: ades,
            vidas: vid,
            adimplencia: adim
        });
        
        // Verificar se todas as conversões foram bem-sucedidas
        if (isNaN(vend) || isNaN(ades) || isNaN(vid) || isNaN(adim)) {
            throw new Error("Todos os valores precisam ser números válidos");
        }
        
        // Calcular metas
        const per = PERIODOS[periodo];
        const meta_vendas = METAS[categoria].vendas * per;
        const meta_vidas = METAS[categoria].vidas * per;
        
        console.log("Metas calculadas:", {
            meta_vendas,
            meta_vidas
        });
        
        // Calcular percentuais
        const vendas_total = vend + Math.min(ades, meta_vendas * 0.25);
        const p_vendas = Math.min((vendas_total / meta_vendas) * 100, 100);
        const p_vidas = Math.min((vid / meta_vidas) * 100, 100);
        const p_adimplencia = Math.min(adim, 100);
        
        console.log("Percentuais calculados:", {
            vendas_total,
            p_vendas,
            p_vidas,
            p_adimplencia
        });
        
        // Calcular média
        const media = Math.round((p_vendas + p_vidas + p_adimplencia) / 3 * 100) / 100;
        console.log("Média calculada:", media);
        
        // Determinar ação baseada na média
        const indice_atual = CATEGORIAS.indexOf(categoria);
        let acao_texto, acao_icone, acao_classe, proximo_nivel;
        
        if (media >= 90 && indice_atual < CATEGORIAS.length - 1) {
            acao_texto = "Você subiu de nível devido à alta pontuação!";
            acao_icone = "fas fa-arrow-up";  // Font Awesome icon
            acao_classe = "text-success";
            proximo_nivel = CATEGORIAS[indice_atual + 1];
        } else if (media < 70 && indice_atual > 0) {
            acao_texto = "Você caiu de nível devido à baixa pontuação.";
            acao_icone = "fas fa-arrow-down";  // Font Awesome icon
            acao_classe = "text-alert";
            proximo_nivel = CATEGORIAS[indice_atual - 1];
        } else {
            acao_texto = "Você permaneceu no mesmo nível.";
            acao_icone = "fas fa-equals";  // Font Awesome icon
            acao_classe = "text-secondary";
            proximo_nivel = categoria;
        }
        
        console.log("Ação determinada:", {
            acao_texto,
            acao_classe,
            proximo_nivel
        });
        
        // Criar elementos para resultado
        const novoConteudo = document.createElement('div');
        
        // Adicionar indicadores
        const indicadoresEl = document.createElement('div');
        indicadoresEl.className = 'indicadores';
        
        // Ícones para os indicadores usando Font Awesome
        indicadoresEl.appendChild(criarIndicador("Meta de Vendas", formatarMoeda(meta_vendas), "fas fa-money-bill-wave"));
        indicadoresEl.appendChild(criarIndicador("Meta de Vidas", meta_vidas, "fas fa-users"));
        indicadoresEl.appendChild(criarIndicador("Vendas Realizadas", `${p_vendas.toFixed(1)}%`, "fas fa-shopping-cart", p_vendas));
        indicadoresEl.appendChild(criarIndicador("Vidas Realizadas", `${p_vidas.toFixed(1)}%`, "fas fa-user-plus", p_vidas));
        indicadoresEl.appendChild(criarIndicador("Adimplência", `${p_adimplencia.toFixed(1)}%`, "fas fa-check-circle", p_adimplencia));
        
        novoConteudo.appendChild(indicadoresEl);
        
        // Adicionar resultado final
        const resultadoFinal = document.createElement('div');
        resultadoFinal.className = 'result-summary';
        resultadoFinal.innerHTML = `
            <div class="result-score">
                <span class="icon text-highlight"><i class="fas fa-star"></i></span>
                <h3>Pontuação Geral: ${media}%</h3>
            </div>
            <div class="result-action ${acao_classe || ''}">
                <span class="icon"><i class="${acao_icone}"></i></span>
                ${acao_texto}
            </div>
        `;
        
        novoConteudo.appendChild(resultadoFinal);
        
        // Adicionar badge de nível
        const nivelBadge = document.createElement('div');
        nivelBadge.className = 'level-badge-container';
        nivelBadge.innerHTML = `
            <div class="level-badge">Próximo nível: ${proximo_nivel}</div>
        `;
        nivelBadge.style.textAlign = 'center';
        
        novoConteudo.appendChild(nivelBadge);
        
        // Adicionar barra de progresso
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${media}%"></div>
            </div>
        `;
        
        novoConteudo.appendChild(progressContainer);
        
        // Atualizar conteúdo
        if (resultadoContent) {
            resultadoContent.innerHTML = '';
            resultadoContent.appendChild(novoConteudo);
        }
        
        console.log("Conteúdo de resultado atualizado");
        
        // Gerar gráficos
        gerarGraficos(meta_vendas, vendas_total, meta_vidas, vid, p_vendas, p_vidas, p_adimplencia);
    } catch (error) {
        console.error("Erro no cálculo:", error);
        // Exibir mensagem de erro
        if (resultadoContent) {
            resultadoContent.innerHTML = `
                <div class="error-message">
                    <strong>Erro no Cálculo:</strong> ${error.message || "Ocorreu um erro ao calcular os resultados."}
                </div>
            `;
        }
    } finally {
        // Esconder overlay de carregamento
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }, 500); // Pequeno atraso para mostrar o loading
    }
}

// Função para gerar gráficos
function gerarGraficos(meta_vendas, vendas_realizadas, meta_vidas, vidas_realizadas, p_vendas, p_vidas, p_adimplencia) {
    try {
        console.log("Iniciando geração de gráficos");
        
        // Mostrar container de gráficos
        if (semGrafico && chartsContainer) {
            semGrafico.style.display = 'none';
            chartsContainer.style.display = 'block';
        }
        
        // Destruir gráficos anteriores se existirem
        if (vendasChart) vendasChart.destroy();
        if (vidasChart) vidasChart.destroy();
        if (radarChart) radarChart.destroy();
        
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.error("Chart.js não está disponível");
            throw new Error("Biblioteca de gráficos não está disponível");
        }
        
        // Gráfico de Vendas
        const ctxVendas = document.getElementById('vendas-chart');
        if (ctxVendas) {
            vendasChart = new Chart(ctxVendas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Meta', 'Realizadas'],
                    datasets: [{
                        label: 'Vendas',
                        data: [meta_vendas, vendas_realizadas],
                        backgroundColor: ['#3498db', '#2ecc71'],
                        borderColor: ['#2980b9', '#27ae60'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatarMoeda(value);
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Desempenho em Vendas',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return formatarMoeda(context.parsed.y);
                                }
                            }
                        }
                    }
                }
            });
            console.log("Gráfico de vendas criado");
        }
        
        // Gráfico de Vidas
        const ctxVidas = document.getElementById('vidas-chart');
        if (ctxVidas) {
            vidasChart = new Chart(ctxVidas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Meta', 'Realizadas'],
                    datasets: [{
                        label: 'Vidas',
                        data: [meta_vidas, vidas_realizadas],
                        backgroundColor: ['#9b59b6', '#e74c3c'],
                        borderColor: ['#8e44ad', '#c0392b'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Desempenho em Vidas',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        }
                    }
                }
            });
            console.log("Gráfico de vidas criado");
        }
        
        // Gráfico Radar
        const ctxRadar = document.getElementById('radar-chart');
        if (ctxRadar) {
            radarChart = new Chart(ctxRadar.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: ['Vendas', 'Vidas', 'Adimplência'],
                    datasets: [{
                        label: 'Percentuais de Desempenho',
                        data: [p_vendas, p_vidas, p_adimplencia],
                        backgroundColor: 'rgba(22, 160, 133, 0.2)',
                        borderColor: '#16a085',
                        borderWidth: 2,
                        pointBackgroundColor: '#2980b9',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#2980b9',
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: {
                                stepSize: 25
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Comparativo de Percentuais',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                }
            });
            console.log("Gráfico radar criado");
        }
        
    } catch (error) {
        console.error("Erro ao gerar gráficos:", error);
        // Mostrar mensagem de erro nos gráficos
        if (semGrafico) {
            semGrafico.innerHTML = `
                <span class="icon large"><i class="fas fa-exclamation-triangle"></i></span>
                <p>Não foi possível gerar os gráficos: ${error.message}</p>
            `;
            semGrafico.style.display = 'flex';
        }
        if (chartsContainer) {
            chartsContainer.style.display = 'none';
        }
    }
}

// Adicionar event listener para o botão calcular
if (btnCalcular) {
    btnCalcular.addEventListener('click', calcularResultados);
    console.log("Listener do botão calcular configurado");
} else {
    console.error("Botão calcular não encontrado no DOM");
}

// Inicialização: esconder o loading
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado, inicializando script");
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Dicas visuais para campos numéricos
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // Permitir vírgula nos campos numéricos
        input.addEventListener('keypress', function(e) {
            if (e.key === ',') {
                e.preventDefault();
                // Inserir vírgula no campo
                const start = this.selectionStart;
                const end = this.selectionEnd;
                const value = this.value;
                this.value = value.substring(0, start) + ',' + value.substring(end);
                // Posicionar cursor após a vírgula
                this.selectionStart = this.selectionEnd = start + 1;
            }
        });
    });
    
    console.log("Inicialização do script de cálculo concluída");
});