<script>
    import { onMount } from 'svelte';

    let languages = [
        { code: "en", label: "🇺🇸 English" },
        { code: "hi", label: "🇮🇳 हिंदी" },
    ];
    let isOpen = false;
    let selectedLanguage = null;
    let placeholder = languages.map(lang => lang.label.split(' ')[0]).join('') + " Language";
    export let value = languages[0].code;

    const selectLanguage = (lang) => {
        selectedLanguage = lang;
        value = lang.code;
        isOpen = false;
    };

    function clickOutside(node) {
        const handleClick = event => {
            if (node && !node.contains(event.target) && !event.defaultPrevented) {
                isOpen = false;
            }
        };

        document.addEventListener('click', handleClick, true);

        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        }
    }

    const closeOnEscape = (event) => {
        if (event.key === 'Escape') {
            isOpen = false;
        }
    };

    onMount(() => {
        window.addEventListener('keydown', closeOnEscape);
        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        };
    });
</script>

<div class="dropdown" on:click={() => isOpen = !isOpen} use:clickOutside>
	<div class="dropdown-toggle">
		{selectedLanguage ? selectedLanguage.label : placeholder}
	</div>
	{#if isOpen}
		<div class="dropdown-menu">
			{#each languages as language (language.code)}
				<div class="dropdown-item" on:click|stopPropagation={() => selectLanguage(language)}>
					{language.label}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
    .dropdown {
        position: relative;
        display: inline-block;
    }
    .dropdown-toggle {
        padding: 5px 10px;
        color: #333;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        :hover {
            border-color: #bbb;
            box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
        }
    }
    .dropdown-menu {
        display: block;
        position: absolute;
        z-index: 1;
        cursor: pointer;
    }
    .dropdown-item {
        padding: 10px 20px;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        transition: background-color 0.2s ease;
        white-space: nowrap;

        :hover {
            background-color: #f5f5f5;
        }
        :last-child {
            border-bottom: none;
        }
    }
</style>