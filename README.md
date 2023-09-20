# Svelte + Vite

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```


          <!-- Start actions... -->
          <!-- <div id="action4" data-linked-action="3" class="equipment-action input-key action4 locked">
            <div class="key-inner">
              <span>{$config.leftHanded ? "A" : ";"}</span>
              <img class="svg" src="/assets/ui/aimed-shot.svg" alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Blast at close range</h3>
              <p>You stuff the barrel of the rifle with dozens of razor sharp projectiles. The closer an enemy, the more savagely will their flesh be torn.</p>
              <p style="font-family: var(--serif-italic);">[Bravado]</p>
            </div>
          </div> -->

          <!-- <div id="action3" data-linked-action="2" class="equipment-action input-key action3 locked">
            <div class="key-inner">
              <span>{$config.leftHanded ? "S" : "L"}</span>
              <img class="svg" src="/assets/ui/land-mine.svg" alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Set landmine</h3>
              <p>You produce an oily iron capsule from the pouch at your waist. Once planted in the earth, it can be detonated from a distance. Be careful, as the blast can harm you as well.</p>
              <p  style="font-family: var(--serif-italic);">[Guile]</p>
            </div>
          </div> -->

<!-- 
        <div id="action2" data-linked-action="1" class="equipment-action input-key action2">
          <div class="key-inner">
            <span>{$config.leftHanded ? "D" : "K"}</span>
            <img class="svg" src="/assets/ui/bayonet.svg" alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Slash with bayonet</h3>
            <p>A quick slash with the blade attachment on the rifle. Does little damage.</p>
            <p  style="font-family: var(--serif-italic);">[Bravado]</p>
          </div>
        </div> -->

        <!-- <div id="action1" data-linked-action="0" class="equipment-action input-key action1">
          <div class="key-inner">
            <span>{$config.leftHanded ? "F" : "J"}</span>
            <img class="svg" src="/assets/ui/muzzle-blast.svg" alt="">
          </div>
          <div class="action-active-indicator is-prepared"></div>
          <div class="action-tooltip">
            <h3>Shoot from a distance</h3>
            <p>You ready the rifle and take careful aim. Your eyes narrow and time seems to stop.</p>
            <p style="font-family: var(--serif-italic);">[Cruelty]</p>
          </div>
        </div> -->
        <!-- End actions... -->