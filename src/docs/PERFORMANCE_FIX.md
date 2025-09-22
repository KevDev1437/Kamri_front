# Correctif Performance - Configuration Vite/Quasar

## 🐛 Problème résolu

### Erreur initiale

```
Error: Dynamic require of 'vite-plugin-compression' is not supported
```

### Cause

Dans `quasar.config.js`, le plugin était ajouté **par son nom (string)**, ce qui forçait Quasar à faire un `require()` dynamique. Or la configuration est **ESM** (Node 20), donc le `require` dynamique n'est pas supporté.

## ✅ Solution appliquée

### 1. Import ESM du plugin

```javascript
// quasar.config.js
import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'
import viteCompression from 'vite-plugin-compression' // ← Import ESM
```

### 2. Configuration via vitePlugins

```javascript
vitePlugins: [
  // ... autres plugins

  // Compression gzip + brotli
  [
    viteCompression,
    {
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    },
  ],
  [
    viteCompression,
    {
      algorithm: 'brotliCompress',
      ext: '.br',
      compressionOptions: { level: 11 },
    },
  ],
],
```

### 3. Installation du plugin

```bash
npm install -D vite-plugin-compression@latest
```

## 🔧 Changements effectués

### Fichiers modifiés

- ✅ **`quasar.config.js`** : Import ESM + configuration via vitePlugins
- ✅ **`package.json`** : Ajout de `vite-plugin-compression` en devDependency

### Configuration finale

```javascript
// quasar.config.js
import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'
import viteCompression from 'vite-plugin-compression'

export default defineConfig((ctx) => {
  return {
    // ... autres configurations

    build: {
      // ... autres options build

      extendViteConf(viteConf) {
        viteConf.build = viteConf.build || {}
        viteConf.build.cssCodeSplit = true
        viteConf.build.commonjsOptions = { transformMixedEsModules: true }

        viteConf.build.rollupOptions = viteConf.build.rollupOptions || {}
        viteConf.build.rollupOptions.output = viteConf.build.rollupOptions.output || {}
        viteConf.build.rollupOptions.output.manualChunks = {
          // ... manual chunks
        }

        // drop console/debugger (esbuild options)
        viteConf.esbuild = viteConf.esbuild || {}
        viteConf.esbuild.drop = ['console', 'debugger']
      },

      vitePlugins: [
        // ... autres plugins

        // Compression gzip + brotli
        [
          viteCompression,
          {
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
          },
        ],
        [
          viteCompression,
          {
            algorithm: 'brotliCompress',
            ext: '.br',
            compressionOptions: { level: 11 },
          },
        ],
      ],
    },
  }
})
```

## 🎯 Résultat

### ✅ Problème résolu

- ✅ **Import ESM** : Plus de `require()` dynamique
- ✅ **Configuration fonctionnelle** : Plugins de compression actifs
- ✅ **ESLint** : 0 erreur
- ✅ **Serveur de dev** : Démarre correctement

### 🚀 Fonctionnalités actives

- ✅ **Compression Gzip** : Fichiers `.gz` générés
- ✅ **Compression Brotli** : Fichiers `.br` générés
- ✅ **Code-splitting** : Manual chunks fonctionnels
- ✅ **Minification** : Console/debugger supprimés
- ✅ **CSS code split** : CSS séparé par chunk

## 🧪 Tests de validation

### Configuration

- ✅ **Import ESM** : `import viteCompression from 'vite-plugin-compression'`
- ✅ **Plugin installé** : `npm list vite-plugin-compression` ✓
- ✅ **ESLint** : `npm run lint` ✓
- ✅ **Serveur dev** : `npm run dev` ✓

### Build

- ✅ **Build optimisé** : `npm run build` génère des chunks séparés
- ✅ **Compression** : Fichiers `.br` et `.gz` présents dans `/dist/spa`
- ✅ **Analyse bundles** : `npm run analyze` fonctionne

## 📝 Commande de Commit

```bash
fix(perf): correctif config ESM pour vite-plugin-compression, import ESM + vitePlugins
```

## 🎉 Résultat final

La configuration performance est maintenant **100% fonctionnelle** avec :

- ✅ **Import ESM** compatible Node 20
- ✅ **Compression automatique** (brotli + gzip)
- ✅ **Code-splitting** avec manual chunks
- ✅ **Minification** optimisée
- ✅ **ESLint** : 0 erreur
- ✅ **Serveur de dev** : Démarre sans erreur

**L'optimisation performance est maintenant complètement opérationnelle !** 🚀

## 🔧 Pourquoi ça arrive ?

### Problème ESM vs CommonJS

- `quasar.config.js` est **ESM** (import/export)
- Utiliser `'vite-plugin-compression'` (string) oblige Quasar à faire un `require()` dynamique
- `require()` dynamique **non supporté** en ESM/Node 20
- Solution : Importer **la fonction** (`import viteCompression from ...`) supprime le `require()`

### Bonnes pratiques

- ✅ **Import ESM** : `import viteCompression from 'vite-plugin-compression'`
- ✅ **Configuration via vitePlugins** : Plus propre et compatible
- ✅ **Options de compression** : Seuil et niveau optimisés
- ✅ **Compatibilité Node 20** : Configuration moderne

Le correctif est maintenant **complètement opérationnel** et prêt pour la production ! 🎯
