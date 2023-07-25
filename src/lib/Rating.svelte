<script>
    import { onMount, onDestroy } from 'svelte';
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css'; // don't forget to import the CSS

    // SVG assets
    import cancelSvg from '../assets/cancel.svg?raw';
    import starSvg from '../assets/star.svg?raw';

    // This should be called when a new rating is selected
    export let onSelected = (r) => {};

    // The current rating, null means that nothing is selected
    export let rating = null;

    const descriptions = [
        "Remove images with big mistakes, like bad distortions or fake watermarks/signatures. It's easy to tell they're not real.",
        "Rate as 1 if the image looks a bit wrong but has some real-looking parts. This might be due to strange body parts or weird looking objects.",
        "Give a 2 if at first glance the image seems fine, but you spot some mistakes when you look closer. This could be due to weird interactions or missing parts.",
        "A 3-star image has very small mistakes that are hard to see. Or it's just an average, unexciting image that lacks creativity.",
        "Rate as 4 if the image looks almost like a real artwork/photo, but has a few minor mistakes. The image should look generally well-composed and realistic.",
        "Only give a 5 if the image is extraordinary, looking like a professional artwork or real photo. It should be exciting and interesting. Only for the very best images."
    ];

    // Function to set a new rating
    const setRating = (newRating) => {
        rating = newRating;
        onSelected(newRating);
    };

    const handleKeyDown = (event) => {
        if (event.key >= '0' && event.key <= '5') {
            setRating(Number(event.key));
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
        descriptions.forEach((description, i) => {
            const tooltip = document.getElementById(`tooltip-${i}`);
            tippy(tooltip, {
                content: description,
            });
        });
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });
</script>

<div class="rating-wrapper">
	<div class="rating-container">
		<div class="rating-item" on:click={() => setRating(0)} class:highlighted={rating === 0} id="tooltip-0">
			<span class="icon icon-cancel">{@html cancelSvg}</span>
		</div>
		{#each descriptions as description, i (i)}
			{#if i > 0}
				<div class="rating-item" on:click={() => setRating(i)} class:highlighted={rating >= i} id={`tooltip-${i}`}>
					<span class="icon">{@html starSvg}</span>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
    .rating-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

    .rating-container {
		display: flex;
    }

    .rating-item {
        cursor: pointer;
		display: block;
    }

	:global(svg) {
		width: 32px;
		height: 32px;
	}

    .icon {
        display: inline-block;

        :global(svg) {
            fill: #A9A9A9; // Dark Gray
        }

		&:hover {
			:global(svg) {
				fill: lighten(#A9A9A9, 20%);
            }
        }
    }

    .highlighted {
        .icon {
            :global(svg) {
                fill: $primary-color;
				filter: drop-shadow(0px 2px 0 rgba(0, 0, 0, 0.1));
            }

            &:hover {
                :global(svg) {
                    fill: lighten($primary-color, 20%);
                }
            }
        }

        .icon-cancel {
            :global(svg) {
                fill: $cancel-color; // Firebrick
            }

            &:hover {
                :global(svg) {
                    fill: lighten($cancel-color, 20%);
                }
            }
        }
    }
</style>