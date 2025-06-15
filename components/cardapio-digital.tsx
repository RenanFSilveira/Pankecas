"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { menuData, categoryNames, categoriesList, type MenuItem } from "@/lib/menu-data"

// Declaração de tipos para GTM/GA4 e Meta Pixel
declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (command: string, eventName: string, parameters?: Record<string, any>) => void;
  }
}

type ItemCarrinho = {
  produto: MenuItem
  quantidade: number
}

type FormularioCliente = {
  nome: string
  telefone: string
  endereco: string
  complemento: string
  retiradaNaLoja: boolean
  formaPagamento: "dinheiro" | "pix" | "cartao"
}

export function CardapioDigital() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([])
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [formulario, setFormulario] = useState<FormularioCliente>({
    nome: "",
    telefone: "",
    endereco: "",
    complemento: "",
    retiradaNaLoja: false,
    formaPagamento: "dinheiro",
  })

  const categoriasRef = useRef<HTMLDivElement>(null)
  const secoesCategorias = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const secoesCategoriasVisiveisEmTodos = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [categoriaDestacadaMenu, setCategoriaDestacadaMenu] = useState<string | null>(
    categoriesList.find(cat => cat !== "todos") || null
  );

  useEffect(() => {
    const atualizarImagemPenne = () => {
      const penneItem = menuData.find((item) => item.id === 23)
      if (penneItem) {
        penneItem.image = "/penne-crispy.jpg"
      }
    }
    atualizarImagemPenne()
  }, [])

  const adicionarAoCarrinho = (produto: MenuItem) => {
    // Tracking GTM/GA4 - Evento add_to_cart
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "BRL",
          value: produto.price,
          items: [
            {
              item_id: produto.id.toString(),
              item_name: produto.name,
              item_category: produto.category,
              price: produto.price,
              quantity: 1,
            },
          ],
        },
      });
    }

    setItensCarrinho((itens) => {
      const itemExistente = itens.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        return itens.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      } else {
        return [...itens, { produto, quantidade: 1 }]
      }
    })
    setCarrinhoAberto(true)
  }

  const alterarQuantidade = (id: number, acao: "aumentar" | "diminuir") => {
    setItensCarrinho((itens) => {
      return itens.map((item) => {
        if (item.produto.id === id) {
          const novaQuantidade = acao === "aumentar" ? item.quantidade + 1 : Math.max(1, item.quantidade - 1)
          return { ...item, quantidade: novaQuantidade }
        }
        return item
      })
    })
  }

  const removerItem = (id: number) => {
    setItensCarrinho((itens) => itens.filter((item) => item.produto.id !== id))
  }

  const calcularTotal = () => {
    return itensCarrinho.reduce((total, item) => {
      return total + item.produto.price * item.quantidade
    }, 0)
  }

  const produtosFiltrados =
    categoriaAtiva === "todos" ? menuData : menuData.filter((produto) => produto.category === categoriaAtiva)

  const atualizarFormulario = (campo: keyof FormularioCliente, valor: any) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
  }

  const enviarPedido = () => {
    const { nome, telefone, endereco, complemento, retiradaNaLoja, formaPagamento } = formulario
    if (!nome || !telefone || (!retiradaNaLoja && !endereco)) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Geração de event_id para deduplicação (usado tanto no navegador quanto no servidor)
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Tracking GTM/GA4 - Evento purchase com customer_info padronizado
    if (typeof window !== 'undefined') {
      const transactionId = `T_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Função para formatar telefone com código internacional (+55)
      const formatarTelefone = (telefone: string) => {
        // Remove tudo que não for número
        const apenasNumeros = telefone.replace(/\D/g, "");
        
        // Se já tiver o 55 no início, retorna como está
        if (apenasNumeros.startsWith("55")) {
          return apenasNumeros;
        }

        // Se tiver 10 ou mais dígitos (DDD + número), adiciona o 55 na frente
        if (apenasNumeros.length >= 10) {
          return `55${apenasNumeros}`;
        }

        // Fallback (caso venha algo inválido)
        return apenasNumeros;
      };

      // Separar primeiro nome e último nome
      const [primeiroNome, ...resto] = nome.trim().split(" ");
      const ultimoNome = resto.join(" ");
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: transactionId,
          affiliation: "Pankeca's - Cardápio Digital",
          value: calcularTotal(),
          tax: 0,
          shipping: 0,
          currency: "BRL",
          items: itensCarrinho.map(item => ({
            item_id: item.produto.id.toString(),
            item_name: item.produto.name,
            item_category: item.produto.category,
            price: item.produto.price,
            quantity: item.quantidade,
          })),
        },
        customer_info: {
          primeiro_nome: primeiroNome,
          ultimo_nome: ultimoNome,
          telefone: formatarTelefone(telefone),
          endereco: retiradaNaLoja ? "Retirar na loja" : endereco,
          complemento,
          forma_pagamento: formaPagamento,
          tipo_entrega: retiradaNaLoja ? "retirada" : "entrega",
        },
      });

      // --- INÍCIO DA MODIFICAÇÃO PARA META PIXEL (NAVEGADOR) --- 
      // Dispara o evento de compra para o Meta Pixel via navegador
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: calcularTotal(),
          currency: 'BRL',
          content_type: 'product_group', 
          contents: itensCarrinho.map(item => ({
            id: item.produto.id.toString(),
            quantity: item.quantidade,
            item_price: item.produto.price,
          })),
          event_id: eventId, // Adiciona o event_id para deduplicação
        });
      }
      // --- FIM DA MODIFICAÇÃO PARA META PIXEL (NAVEGADOR) --- 

      // --- INÍCIO DA MODIFICAÇÃO PARA ENVIO AO BACKEND CAPI --- 
      // Enviar evento para o backend CAPI (servidor)
      fetch(`https://capi.respondipravoce.com.br/track-purchase`, { // <-- ATENÇÃO: Substitua SEU_DOMINIO_OU_IP_DA_VPS pelo IP público da sua VPS ou pelo domínio que aponta para ela.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId, // O mesmo event_id para deduplicação
          value: calcularTotal(),
          currency: 'BRL',
          items: itensCarrinho.map(item => ({
            id: item.produto.id.toString(),
            quantity: item.quantidade,
            item_price: item.produto.price,
          })),
          customer_info: {
            primeiro_nome: primeiroNome,
            ultimo_nome: ultimoNome,
            telefone: formatarTelefone(telefone),
            endereco: retiradaNaLoja ? 'Retirar na loja' : endereco,
            complemento: complemento,
            forma_pagamento: formaPagamento,
            tipo_entrega: retiradaNaLoja ? 'retirada' : 'entrega',
            // Adicione outros dados do cliente que você queira enviar para o CAPI, como email
            // email: 'email_do_cliente@exemplo.com', // Exemplo: se você coletar email
          },
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log('Resposta do backend CAPI:', data))
      .catch(error => console.error('Erro ao enviar para o backend CAPI:', error));
      // --- FIM DA MODIFICAÇÃO PARA ENVIO AO BACKEND CAPI --- 
    }

    // --- INÍCIO DA MODIFICAÇÃO PARA ATRASO DE REDIRECIONAMENTO --- 
    const mensagemCodificada = encodeURIComponent(`*Novo Pedido - Pankeca's*\n\n*Cliente:* ${nome}\n*Telefone:* ${telefone}\n${retiradaNaLoja ? '*Retirada:* Na loja\n' : `*Endereço:* ${endereco}\n${complemento ? `*Complemento:* ${complemento}\n` : ''}`}*Forma de Pagamento:* ${formaPagamento === "dinheiro" ? "Dinheiro" : formaPagamento === "pix" ? "PIX" : "Cartão de Crédito/Débito"}\n\n*Itens do Pedido:*\n${itensCarrinho.map(item => `- ${item.quantidade}x ${item.produto.name} (R$ ${(item.produto.price * item.quantidade).toFixed(2)})`).join('\n')}\n\n*Total:* R$ ${calcularTotal().toFixed(2)}`);
    const numeroWhatsApp = "5527999999154"
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`

    // Atrasar o redirecionamento para garantir que o evento do Pixel seja enviado
    setTimeout(() => {
      window.open(urlWhatsApp, "_blank")
    }, 800); // Atraso de 800 milissegundos
    // --- FIM DA MODIFICAÇÃO PARA ATRASO DE REDIRECIONAMENTO --- 

    // Opcional: Limpar carrinho após envio
    // setItensCarrinho([])
    // setCarrinhoAberto(false)
    // setMostrarFormulario(false)
  }

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    if (categoriaAtiva === "todos" && typeof window !== "undefined") {
        const observerOptions = {
            root: null, 
            rootMargin: "-128px 0px -65% 0px", 
            threshold: 0.01, 
        };
        const callback = (entries: IntersectionObserverEntry[]) => {
            let bestEntry: IntersectionObserverEntry | null = null;
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
                        bestEntry = entry;
                    }
                }
            }
            if (bestEntry) {
                const categoria = bestEntry.target.getAttribute("data-categoria-scroll");
                if (categoria && categoriaDestacadaMenu !== categoria) {
                    setCategoriaDestacadaMenu(categoria);
                }
            }
        };
        observer = new IntersectionObserver(callback, observerOptions);
        const currentRefs = secoesCategoriasVisiveisEmTodos.current;
        Object.values(currentRefs).forEach((sectionEl) => {
            if (sectionEl) observer!.observe(sectionEl);
        });
    }
    return () => {
        if (observer) {
            const currentRefs = secoesCategoriasVisiveisEmTodos.current;
            Object.values(currentRefs).forEach((sectionEl) => {
                if (sectionEl) observer!.unobserve(sectionEl);
            });
        }
    };
  }, [categoriaAtiva, menuData, categoriesList, categoriaDestacadaMenu]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (categoriaAtiva && categoriaAtiva !== "todos" && secoesCategorias.current[categoriaAtiva]) {
        secoesCategorias.current[categoriaAtiva]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (categoriaAtiva === "todos") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [categoriaAtiva]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <header className="bg-[#8B4513] text-white p-4 sticky top-0 z-50 flex justify-between items-center h-[72px]">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Pankeca's Logo" width={180} height={60} className="h-10 w-auto" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFEEB2] rounded-full scale-125"></div>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-transparent"
            onClick={() => setCarrinhoAberto(!carrinhoAberto)}
          >
            <ShoppingCart className="h-6 w-6 text-[#8B4513]" />
            {itensCarrinho.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#8B4513] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {itensCarrinho.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="relative bg-[#FFF8E1] py-16 px-4 text-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Image src="/PdePankecas.jpg" alt="Pankeca's Background" layout="fill" objectFit="cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Uma escolha autêntica!</h1>
          <p className="text-lg text-[#8B4513]">Escolha suas favoritas e faça seu pedido</p>
        </div>
      </div>

      <div
        ref={categoriasRef}
        className="sticky top-[72px] z-40 bg-[#FFF8E1] py-4 px-2 overflow-x-auto flex justify-start md:justify-center gap-2 shadow-md h-[56px] items-center"
      >
        <div className="flex gap-2 font-[\'WinkyRough\']">
          {categoriesList.map((categoriaLoop) => (
            <Button
              key={categoriaLoop}
              variant="outline"
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium font-[\'WinkyRough\']",
                (categoriaAtiva !== "todos" && categoriaAtiva === categoriaLoop) ||
                (categoriaAtiva === "todos" && categoriaDestacadaMenu === categoriaLoop && categoriaLoop !== "todos")
                  ? "bg-[#8B4513] text-white hover:bg-[#6B3100]"
                  : "bg-[#E6D2B5] text-[#8B4513] hover:bg-[#D4C0A3]",
              )}
              onClick={() => {
                setCategoriaAtiva(categoriaLoop);
                if (categoriaLoop !== "todos") {
                  setCategoriaDestacadaMenu(categoriaLoop);
                } else {
                  const firstActualCategory = categoriesList.find(cat => cat !== "todos");
                  setCategoriaDestacadaMenu(firstActualCategory || null);
                }
              }}
            >
              {categoryNames[categoriaLoop]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold text-center text-[#8B4513] mb-8">Cardápio</h1>

        {categoriaAtiva === "todos" && (
          <div>
            {categoriesList
              .filter((cat) => cat !== "todos") 
              .map((categoryKey) => {
                const itemsInCategory = menuData.filter((produto) => produto.category === categoryKey);
                if (itemsInCategory.length === 0) return null; 

                return (
                  <div
                    key={categoryKey}
                    ref={(el) => { secoesCategoriasVisiveisEmTodos.current[categoryKey] = el; }}
                  
(Content truncated due to size limit. Use line ranges to read in chunks)
