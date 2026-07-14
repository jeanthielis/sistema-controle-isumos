# Fábrica 2 — Deploy

## Estrutura de pastas

```
fabrica2/
├── index.html
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
├── firebase.json        (deploy opcional via Firebase Hosting)
├── .firebaserc           (deploy opcional via Firebase Hosting)
├── netlify.toml          (deploy via Netlify)
└── firestore.rules       (sempre necessário — regras do banco)
```

> Independente de onde você hospeda o site (Firebase Hosting, Netlify, Vercel etc.),
> o **banco de dados continua sendo o Firestore** do projeto `insumo-pro`. Hospedagem
> é só onde o `index.html` fica servido; os dados do app (insumos, usuários, logs)
> sempre vêm do Firebase.

## Opção A — GitHub + Netlify (o que você vai usar)

1. **Suba a pasta para um repositório no GitHub:**
   ```bash
   cd fabrica2
   git init
   git add .
   git commit -m "Fábrica 2 - dashboard de insumos"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/fabrica2.git
   git push -u origin main
   ```

2. **No Netlify** (app.netlify.com):
   - "Add new site" → "Import an existing project" → conecte sua conta GitHub → escolha o repositório.
   - O `netlify.toml` já configura tudo sozinho: pasta publicada = raiz do repositório,
     e redireciona todas as rotas para `index.html` (necessário porque o app é uma SPA).
   - Clique em "Deploy site". Em ~1 minuto você recebe uma URL tipo
     `https://seu-app.netlify.app`.

3. **Ative Authentication e Firestore no Firebase** (se ainda não fez):
   - console.firebase.google.com → projeto `insumo-pro`
   - Build → Authentication → Sign-in method → habilitar **E-mail/senha**
   - Build → Firestore Database → criar banco (se ainda não existir)

4. **Publique as regras de segurança do Firestore** — isso é feito pela CLI do
   Firebase, independente de onde o site está hospedado:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

5. **Autorize o domínio da Netlify no Firebase Authentication:**
   - console.firebase.google.com → Authentication → Settings → Authorized domains
   - Adicione `seu-app.netlify.app` (senão o login/cadastro é bloqueado por segurança).

6. **Crie o primeiro administrador:**
   - Abra a URL da Netlify, clique em "cadastrar" → você entra como **Inspetor**.
   - No Console do Firebase → Firestore Database → coleção `usuarios` → seu
     documento → troque `role` de `"inspetor"` para `"administrador"`.
   - Recarregue o app. Agora você já cadastra as próximas pessoas pela tela
     "Níveis de Acesso", sem voltar ao Console.

## Opção B — Firebase Hosting (alternativa, arquivos também inclusos)

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

## Sobre o funcionamento offline

O `sw.js` incluído faz cache apenas do "esqueleto" do app (HTML/manifest),
então ele abre mais rápido e funciona parcialmente offline. Os dados
(insumos, auditorias, usuários) continuam precisando de internet, porque
vêm do Firestore em tempo real. Se quiser dados realmente disponíveis
offline, ative a **persistência offline do Firestore**
(`firebase.firestore().enablePersistence()`) — posso adicionar isso se
for útil para o seu cenário de uso (ex: chão de fábrica com wifi instável).

