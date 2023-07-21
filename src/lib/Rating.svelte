<script>
    import { onMount, onDestroy } from 'svelte';

    // SVG assets
    import cancelSvg from '../assets/cancel.svg?raw';
    import starSvg from '../assets/star.svg?raw';

    // This should be called when a new rating is selected
    export let onSelected = (r) => {};

    // The current rating, null means that nothing is selected
    export let rating = null;

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
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });
</script>

<div class="rating-wrapper">
	<div class="rating-container">
		<div class="rating-item" on:click={() => setRating(0)} class:highlighted={rating === 0}><span class="icon icon-cancel">{@html cancelSvg}</span></div>
		<div class="rating-item" on:click={() => setRating(1)} class:highlighted={rating >= 1}><span class="icon">{@html starSvg}</span></div>
		<div class="rating-item" on:click={() => setRating(2)} class:highlighted={rating >= 2}><span class="icon">{@html starSvg}</span></div>
		<div class="rating-item" on:click={() => setRating(3)} class:highlighted={rating >= 3}><span class="icon">{@html starSvg}</span></div>
		<div class="rating-item" on:click={() => setRating(4)} class:highlighted={rating >= 4}><span class="icon">{@html starSvg}</span></div>
		<div class="rating-item" on:click={() => setRating(5)} class:highlighted={rating >= 5}><span class="icon">{@html starSvg}</span></div>
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