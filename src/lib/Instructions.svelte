<script>
    import { onMount } from 'svelte';
    import Video from './Video.svelte';
    import { marked } from 'marked';
    import LanguageSelector from "./LanguageSelector.svelte";

    let lang = 'en';
    export let displayed = false;
    let pageContent = '';
    let pageVideo = '';

    const content = {
        'en' : {
            'home': {
                'content': import('../content/en/home.md?raw'),
                'video': '0cdbb2992743be323c299b86c9ec560f',
            },
            // other English pages...
        },
        'hi' : {
            'home': {
                'content': import('../content/hi/home.md?raw'),
                'video': '4f322d1972ac2994e2dedf7aeffc0866',
            },
            // other Hindi pages...
        },
    }

    // Load the interface text from ../content/instructions.json
    let interfaceText = {};
    onMount(async () => {
        const module = await import('../content/instructions.json?raw');
		interfaceText = JSON.parse(module.default);
    });

    // Update page content whenever the selected language changes
    $: displayPage('home', lang);

    onMount(async () => {
        displayPage('home', lang);
    });

    // Action function
    function interceptNavigation(node) {
        node.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', event => {
                event.preventDefault();
                let page = event.target.getAttribute('href').substring(1);
                displayPage(page, lang);
            });
        });

        return {
            destroy() {
                node.querySelectorAll('a[href^="#"]').forEach(a => {
                    a.removeEventListener('click');
                });
            }
        };
    }

    export function closeModal() {
        // If an event was given, prevent default
        displayed = false;
    }

    export function openModal() {
        displayed = true;
	}

    export async function displayPage(page, lang) {
        let result = await content[lang][page].content;
        pageContent = marked((await result).default);
        pageVideo = content[lang][page].video;
    }
</script>

{#if displayed}
	<div class="modal-wrapper displayed">
		<div class="modal">
			<div class="top-bar">
				<div class="lang-selector">
					<LanguageSelector bind:value={lang} />
				</div>
				<div class="links">
					{#if interfaceText[lang]}
						<a href="#instructions" on:click|preventDefault={() => displayPage('home', lang)}>{interfaceText[lang]['home']}</a>
						<a href="#instructions" on:click|preventDefault={() => displayPage('criteria', lang)}>{interfaceText[lang]['criteria']}</a>
						<a href="#acceptance" on:click|preventDefault={() => displayPage('criteria', lang)}>{interfaceText[lang]['acceptance']}</a>
					{/if}
				</div>
				<button class="close-button" on:click|preventDefault|stopPropagation={closeModal}>{interfaceText[lang]['close']}</button>
			</div>
			{#if pageVideo}
				<Video video={pageVideo} />
			{/if}
			<div class="content" use:interceptNavigation>
				{@html pageContent}
			</div>
		</div>
		<div class="overlay"></div>
	</div>
{/if}

<style lang="scss">
	.modal-wrapper {
        transition: opacity 0.5s ease-in-out;
		display: none;
		opacity: 0;

		&.displayed {
			display: block;
			opacity: 1;
        }

        .modal {
            $modal-padding: 40px;
            position: fixed;
            left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			width: 80%;
			height: 80%;

			max-width: 640px;
			max-height: 900px;

            background-color: white;
            z-index: 100;
            transition: opacity 0.5s ease-in-out;

            .top-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
				background: #F0F0F0;
				margin-bottom: 20px;
				padding: 20px;

                .lang-selector {
					// Disable focus highlighting
					-webkit-tap-highlight-color: rgba(0,0,0,0);
					-webkit-tap-highlight-color: transparent;
					select {
						border: none;
						background: none;
						font-size: 15px;
						cursor: pointer;
						&:focus {
							outline: none;
						}
					}
                }

                .links {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    a {
                        color: #333;
                        text-decoration: none;
						padding: 0 10px;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }

                .close-button {
                    color: #fff;
                    background-color: $primary-color;
                    border: none;
                    border-radius: 3px;
                    padding: 5px 10px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    font-weight: bold;

                    &:hover {
                        background-color: lighten($primary-color, 10%);
                    }

                    &:active {
                        background-color: darken($primary-color, 10%);
                    }

                    &:focus {
                        outline: none;
                    }
                }
            }

			.content {
				padding: 20px;

				:global(:first-child) {
					margin-top: 0;
				}
			}
        }

        .overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: black;
            z-index: 99;
			opacity: 0.8;
        }
	}
</style>