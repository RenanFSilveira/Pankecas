// Dados do cardápio
export type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

export type CategoryMap = {
  [key: string]: string
}

export const menuData: MenuItem[] = [
  // Molho de Tomate
  {
    id: 8,
    name: "Mexicana",
    description:
      "Se gosta realmente de sabor picante, esta é a sua panqueca. Elaborada com o tempero para Taco, páprica picante e pimenta calabresa em flocos este recheio de carne moída ao estilo mexicano pega.",
    price: 34.0,
    image: "/Vermelha.webp",
    category: "molho_tomate",
  },

  // Molho Branco
  {
    id: 11,
    name: "Carne Moída",
    description:
      "Carne moída bem temperada com queijo derretido e tomate, combinando sabores tradicionais em uma receita cheia de sabor.",
    price: 32.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 2,
    name: "Frango com Palmito",
    description:
      "Recheio cremoso, formado por uma combinação especial de palmito em conserva, frango desfiado, creme de leite, catupiry e temperos.",
    price: 32.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 4,
    name: "Camarão com Catupiry",
    description:
      "Recheio tradicional do Pankeca's, fruto de uma combinação que tem como principais ingredientes o camarãoe especial, coentro, queijo e catupiry.",
    price: 38.0,
    image: "/Camarao.jpg",
    category: "molho_branco",
  },
  {
    id: 5,
    name: "Calabresa",
    description:
      "A calabresa é um produto nacional (fique por dentro) se você é um dos amantes, este recheio vai te conquistar. Prove e comprove.",
    price: 32.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 12,
    name: "Nordestina",
    description:
      "Pedida de personalidade, a carne seca desfiada ganhou intensidade com queijo e quase sempre fideliza quem faz esta escolha, criando uma lista cada vez maior de seguidores.",
    price: 35.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 14,
    name: "Bacalhau com Palmito",
    description:
      "Uma deliciosa variação da panqueca de bacalhau. Neste recheio é acrescentado o palmito natural (não é o palmito em conserva) e não vai queijo, uma opção a mais para quem não come carne ou queijo.",
    price: 38.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 15,
    name: "Palmito Natural",
    description:
      "Palmito natural com queijo, azeitonas e temperos especiais, finalizado com azeite e servido com nosso molho branco cremoso. Uma opção leve e cheia de sabor.",
    price: 32.0,
    image: "/Branca.webp",
    category: "molho_branco",
  },
  {
    id: 1,
    name: "Frango com Bacon",
    description: "Bacon em cubos pouco fritos de maneira a ficarem tenros, misturados com frango desfiado e catupiry.",
    price: 32.0,
    image: "/FrangoBacon.jpg",
    category: "molho_branco",
  },

  // Molho Gorgonzola
  {
    id: 6,
    name: "Filé Mignon",
    description:
      "Tiras de filé mignon ao ponto com lascas de queijo e champignon. Harmoniza muito bem com o molho gorgonzola é uma das mais elogiadas pelos nossos clientes.",
    price: 35.0,
    image: "/MolhoGorgonzola2.jpg",
    category: "molho_gorgonzola",
  },
  {
    id: 7,
    name: "Filé Mignon com Bacon",
    description:
      "Bacon em fatias crocantes, filé mignon e pequenas lascas de queijo. Um dos pontos fortes da casa, esta panqueca incorpora o consagrado conceito do medalhão.",
    price: 38.0,
    image: "/MolhoGorgonzola2.jpg",
    category: "molho_gorgonzola",
  },
  {
    id: 3,
    name: "Mineirinha",
    description:
      "Essa panqueca é show! Surpreende pelo paladar e geralmente conquista quem prova. Feita com produto caseiro da família Bullerjahn de Domingos Martins, é uma ótima pedida. Combina linguiça com queijo",
    price: 34.0,
    image: "/MolhoGorgonzola2.jpg",
    category: "molho_gorgonzola",
  },
  {
    id: 9,
    name: "Ricota com Espinafre",
    description:
      "A panqueca que surpreende! Uma combinação maravilhosa que vai muito além do esperado. Receita Premium da casa, leva também creme de leite e especiarias, vale apena conferir. Feita com disco verde.",
    price: 30.0,
    image: "/Ricota.jpg",
    category: "molho_gorgonzola",
  },
  {
    id: 13,
    name: "Frango",
    description:
      "Esta é a panqueca mais tradicional da casa. Receita especial, muito saborosa, leva frango desfiado, temperos, tomate e azeitonas. É uma das panquecas mais pedidas pelos nossos clientes.",
    price: 30.0,
    image: "/MolhoGorgonzola2.jpg",
    category: "molho_gorgonzola",
  },

  // Acompanhamentos
  {
    id: 22,
    name: "Arroz Branco",
    description: "Porção de arroz branco soltinho",
    price: 12.0,
    image: "/ArrozBranco.webp",
    category: "acompanhamentos",
  },
  {
    id: 25,
    name: "Penne ao Gorgonzola",
    description: "Massa penne com molho gorgonzola e queijo gratinado",
    price: 22.0,
    image: "/PdePankecas.jpg",
    category: "acompanhamentos",
  },
  {
    id: 23,
    name: "Penne ao Gorgonzola + Crispy",
    description: "Massa penne com molho gorgonzola, penne crispy e queijo gratinado",
    price: 32.0,
    image: "/penne-crispy.jpg",
    category: "acompanhamentos",
  },

  // Bebidas
  {
    id: 16,
    name: "Coca-Cola",
    description: "Refrigerante Coca-Cola lata",
    price: 7.0,
    image: "/CocaColaNormal.jpg",
    category: "bebidas",
  },
  {
    id: 17,
    name: "Coca-Cola Zero",
    description: "Refrigerante Coca-Cola Zero lata",
    price: 7.0,
    image: "/CocaColaZero.jpg",
    category: "bebidas",
  },
  {
    id: 18,
    name: "Guaraná",
    description: "Refrigerante Guaraná lata",
    price: 7.0,
    image: "/GuaranaNormal.jpg",
    category: "bebidas",
  },
  {
    id: 19,
    name: "Guaraná Zero",
    description: "Refrigerante Guaraná Zero lata",
    price: 7.0,
    image: "/GuaranaZero.jpg",
    category: "bebidas",
  },
  {
    id: 20,
    name: "Água Mineral",
    description: "Água mineral sem gás",
    price: 4.0,
    image: "/AguaSemGas.jpeg",
    category: "bebidas",
  },
  {
    id: 21,
    name: "Água com Gás",
    description: "Água mineral com gás",
    price: 5.0,
    image: "/AguaComGas.jpeg",
    category: "bebidas",
  },
  {
    id: 26,
    name: "Suco 500ml",
    description: "Suco de polpa na garrafinha de 500ml",
    price: 9.0,
    image: "/Suco500ml.webp",
    category: "bebidas",
  },
  /*{
    id: 27,
    name: "Heineken 600ml",
    description: "Garrafa de Heineken 600ml",
    price: 18.0,
    image: "/Heineken600ml.jpg",
    category: "bebidas",
  },
  {
    id: 28,
    name: "Stella 600ml",
    description: "Garrafa de Stella 600ml",
    price: 16.0,
    image: "/Stella600ml.jpg",
    category: "bebidas",
  },
  */
]

// Mapeamento de categorias para nomes amigáveis
export const categoryNames: CategoryMap = {
  todos: "Todos",
  molho_tomate: "Molho de Tomate",
  molho_branco: "Molho Branco",
  molho_gorgonzola: "Molho Gorgonzola",
  acompanhamentos: "Acompanhamentos",
  bebidas: "Bebidas",
}

// Lista de categorias na ordem desejada
export const categoriesList = [
  "todos",
  "molho_tomate",
  "molho_branco",
  "molho_gorgonzola",
  "acompanhamentos",
  "bebidas",
]
