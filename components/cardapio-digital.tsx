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
    let mensagem = `*Novo Pedido - Pankeca's*\n\n`
    mensagem += `*Cliente:* ${nome}\n`
    mensagem += `*Telefone:* ${telefone}\n`
    if (retiradaNaLoja) {
      mensagem += `*Retirada:* Na loja\n`
    } else {
      mensagem += `*Endereço:* ${endereco}\n`
      if (complemento) {
        mensagem += `*Complemento:* ${complemento}\n`
      }
    }
    mensagem += `*Forma de Pagamento:* ${
      formaPagamento === "dinheiro" ? "Dinheiro" : formaPagamento === "pix" ? "PIX" : "Cartão de Crédito/Débito"
    }\n\n`
    mensagem += `*Itens do Pedido:*\n`
    itensCarrinho.forEach((item) => {
      mensagem += `- ${item.quantidade}x ${item.produto.name} (R$ ${(item.produto.price * item.quantidade).toFixed(2)})\n`
    })
    mensagem += `\n*Total:* R$ ${calcularTotal().toFixed(2)}`
    const mensagemCodificada = encodeURIComponent(mensagem)
    const numeroWhatsApp = "5511999999999"
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`
    window.open(urlWhatsApp, "_blank")
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
        <div className="flex gap-2 font-['WinkyRough']">
          {categoriesList.map((categoriaLoop) => (
            <Button
              key={categoriaLoop}
              variant="outline"
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium font-['WinkyRough']",
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
                    data-categoria-scroll={categoryKey} 
                    className="mb-12 pt-2" 
                    id={`section-todos-${categoryKey}`}
                  >
                    <h2
                      className="text-3xl font-['BabyKruffy'] text-[#8B4513] mb-6 py-3 sticky top-[128px] bg-[#FFF8E1] z-30 text-center md:text-left"
                    >
                      {categoryNames[categoryKey]}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {itemsInCategory.map((produto) => (
                        <Card key={produto.id} className="overflow-hidden flex flex-col h-full">
                          <div className="aspect-video w-full overflow-hidden">
                            <Image
                              src={produto.image || "/placeholder.svg"}
                              alt={produto.name}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h2 className="text-xl font-bold text-[#8B4513] mb-2">{produto.name}</h2>
                            <p className="text-sm text-gray-600 mb-4 flex-1">{produto.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-lg font-bold text-[#8B4513]">R$ {produto.price.toFixed(2)}</span>
                              <Button onClick={() => adicionarAoCarrinho(produto)} className="bg-[#8B4513] hover:bg-[#6B3100]">
                                + Adicionar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {categoriaAtiva !== "todos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesList
              .filter((cat) => cat !== "todos")
              .map((categoria) => (
                <div
                  key={categoria}
                  ref={(el) => {
                    secoesCategorias.current[categoria] = el;
                  }}
                  data-categoria={categoria} 
                  className={cn("col-span-full", categoriaAtiva !== categoria && "hidden")} 
                  id={`section-${categoria}`}
                >
                  {menuData.filter((p) => p.category === categoria).length > 0 && (
                    <>
                      <h1 className="text-2xl font-bold text-[#8B4513] mb-4 font-['BabyKruffy'] text-center md:text-left">{categoryNames[categoria]}</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {produtosFiltrados 
                          .map((produto) => (
                            <Card key={produto.id} className="overflow-hidden flex flex-col h-full">
                              <div className="aspect-video w-full overflow-hidden">
                                <Image
                                  src={produto.image || "/placeholder.svg"}
                                  alt={produto.name}
                                  width={400}
                                  height={300}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex flex-col flex-1">
                                <h2 className="text-xl font-bold text-[#8B4513] mb-2">{produto.name}</h2>
                                <p className="text-sm text-gray-600 mb-4 flex-1">{produto.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                  <span className="text-lg font-bold text-[#8B4513]">
                                    R$ {produto.price.toFixed(2)}
                                  </span>
                                  <Button
                                    onClick={() => adicionarAoCarrinho(produto)}
                                    className="bg-[#8B4513] hover:bg-[#6B3100]"
                                  >
                                    + Adicionar
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}

        {carrinhoAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-end">
            <div className="bg-white w-3/4 md:w-full md:max-w-md h-full flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#8B4513]">Seu Carrinho</h2>
                <Button variant="ghost" size="icon" onClick={() => setCarrinhoAberto(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              </div>

              {itensCarrinho.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
                  <p className="text-sm text-gray-400 mt-1">Adicione itens do cardápio!</p>
                </div>
              ) : (
                <ScrollArea className="flex-1 p-4">
                  {itensCarrinho.map((item) => (
                    <div key={item.produto.id} className="flex items-start gap-3 p-3 border-b border-gray-200 last:border-b-0">
                      <Image
                        src={item.produto.image || "/placeholder.svg"}
                        alt={item.produto.name}
                        width={60} 
                        height={60}
                        className="rounded object-cover flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-[#8B4513] text-sm leading-tight mr-2">{item.produto.name}</h3>
                          <p className="text-sm font-semibold text-[#8B4513] whitespace-nowrap">
                            R$ {(item.produto.price * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mb-1.5">
                          Unitário: R$ {item.produto.price.toFixed(2)}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5"> 
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-gray-300 hover:bg-gray-100"
                              onClick={() => alterarQuantidade(item.produto.id, "diminuir")}
                            >
                              <Minus className="h-4 w-4 text-gray-700" />
                            </Button>
                            <span className="text-sm w-6 text-center font-medium text-gray-800">{item.quantidade}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-gray-300 hover:bg-gray-100"
                              onClick={() => alterarQuantidade(item.produto.id, "aumentar")}
                            >
                              <Plus className="h-4 w-4 text-gray-700" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 w-7"
                            onClick={() => removerItem(item.produto.id)}
                          >
                            <Trash2 className="h-4 w-4" /> 
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}

              {itensCarrinho.length > 0 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-700">Total:</span>
                    <span className="text-xl font-bold text-[#8B4513]">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-[#8B4513] hover:bg-[#6B3100] text-white py-3 text-base"
                    onClick={() => setMostrarFormulario(true)}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#8B4513]">Detalhes do Pedido</h2>
                  <Button variant="ghost" size="icon" onClick={() => setMostrarFormulario(false)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </Button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); enviarPedido(); }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome Completo</Label>
                      <Input id="nome" value={formulario.nome} onChange={(e) => atualizarFormulario("nome", e.target.value)} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">Telefone (WhatsApp)</Label>
                      <Input id="telefone" type="tel" value={formulario.telefone} onChange={(e) => atualizarFormulario("telefone", e.target.value)} required className="mt-1" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="retirada" checked={formulario.retiradaNaLoja} onCheckedChange={(checked) => atualizarFormulario("retiradaNaLoja", checked)} />
                      <Label htmlFor="retirada" className="text-sm font-medium text-gray-700">Retirar na Loja</Label>
                    </div>
                    {!formulario.retiradaNaLoja && (
                      <>
                        <div>
                          <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">Endereço para Entrega</Label>
                          <Input id="endereco" value={formulario.endereco} onChange={(e) => atualizarFormulario("endereco", e.target.value)} required={!formulario.retiradaNaLoja} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="complemento" className="text-sm font-medium text-gray-700">Complemento (Opcional)</Label>
                          <Input id="complemento" value={formulario.complemento} onChange={(e) => atualizarFormulario("complemento", e.target.value)} className="mt-1" />
                        </div>
                      </>
                    )}
                    <div className="pt-2">
                      <Label className="text-sm font-medium text-gray-700">Forma de Pagamento</Label>
                      <RadioGroup defaultValue="dinheiro" value={formulario.formaPagamento} onValueChange={(value) => atualizarFormulario("formaPagamento", value as any)} className="mt-2 grid grid-cols-3 gap-4">
                        {["dinheiro", "pix", "cartao"].map((option) => (
                          <Label key={option} htmlFor={`payment-${option}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <RadioGroupItem value={option} id={`payment-${option}`} className="sr-only" />
                            <span className="text-sm font-medium uppercase">{option}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button type="submit" className="bg-[#8B4513] hover:bg-[#6B3100] text-white px-6 py-2.5 text-base">
                      Enviar Pedido via WhatsApp
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>

      <footer className="bg-[#8B4513] text-white text-center p-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} Pankeca's. Todos os direitos reservados.</p>
        <p className="text-sm">Feito com ❤️ por Pankeca's</p>
      </footer>
    </div>
  )
}

