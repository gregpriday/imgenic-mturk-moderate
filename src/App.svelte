<script>
    import { onMount, onDestroy } from 'svelte';
    import {generateCloudFlareUrl} from "./lib/util.js";
    import ImageLoupe from "./lib/ImageLoupe.svelte";
    import Instructions from "./lib/Instructions.svelte";
    import Rating from "./lib/Rating.svelte";
    import ImageGallery from "./lib/ImageGallery.svelte";  // Import the new component

    // SVG Assets
    import leftSvg from './assets/left.svg?raw';
    import rightSvg from './assets/right.svg?raw';
    import RatingHistogram from "./lib/RatingHistogram.svelte";

    let hit = null;

    let selected = 0;
    let instructions;

    function setRatingsInput(){
        let ratingsInput = document.getElementById('ratings-input');
        let ratings = {};

        // For any images that have been rated, add them to the ratings object {id: rating}
        for (let i = 0; i < hit.length; i++) {
            if (hit[i].rating !== null && hit[i].rating !== undefined) {
                ratings[hit[i].id] = hit[i].rating;
            }
        }

        // Set the ratings input value to the ratings object
        ratingsInput.value = JSON.stringify(ratings);
    }

    const selectImage = (index) => {
        selected = index;
    }

    const navigateLeft = () => {
        selected = (selected - 1 + hit.length) % hit.length;
    }

    const navigateRight = () => {
        selected = (selected + 1) % hit.length;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            navigateRight();
        } else if (event.key === 'ArrowLeft') {
            navigateLeft();
        }
    };

    function preloadImages() {
        hit.forEach(image => {
            const img = new Image();
            img.src = generateCloudFlareUrl(image.image, {quality: 60});
        });
    }

    onMount(() => {
        // Load the hit data
        hit = JSON.parse(document.getElementById('hit-data').value);
        window.addEventListener('keydown', handleKeyDown);
        preloadImages();
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    function updateRating(index, newRating) {
        hit[index].rating = newRating;
        // trigger Svelte reactivity by assigning to the same variable
        hit = hit;

        navigateRight();
    }

    function imagesDoneCount(){
        let count = 0;
        for (let i = 0; i < hit.length; i++) {
            if (hit[i].rating !== null && hit[i].rating !== undefined) {
                count++;
            }
        }
        return count;
    }

    let isJobComplete = false;
    let doneCount = 0;
    let totalCount = hit ? hit.length : 30;
    $: if (hit) {
        setRatingsInput();
        doneCount = imagesDoneCount();
        isJobComplete = (doneCount === totalCount);
    }
</script>

{#if hit}
    <div class="mturk-wrapper">

        <div class="progress-wrapper">
            <div class="progress-bar-wrapper"><div class="progress-bar" style="width: {doneCount/totalCount * 100}%"></div></div>

            <div class="progress-parts">
                <!-- Display the submit button if the job is complete-->
                <button class="button-primary" type="submit" disabled={!isJobComplete}>Submit Ratings</button>
                <div class="progress-ratings">
                    <div class="histogram-wrapper">
                        <RatingHistogram hit={hit} />
                    </div>
                    <span>{doneCount}/{totalCount} images rated</span>
                </div>
                <button class="button-primary" on:click|preventDefault={() => {instructions.openModal()}}>Instructions</button>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="image-wrapper">
                {#key selected}
                    <ImageLoupe src={generateCloudFlareUrl(hit[selected].image, {quality: 60})} />
                    <div class="input-wrapper">
                        <button class="navigation-button" aria-label="Previous image" on:click={navigateLeft}>
                            {@html leftSvg}
                        </button>
                        <div>
                            <Rating rating="{hit[selected].rating ?? null}" onSelected={(newRating) => updateRating(selected, newRating)} />
                        </div>
                        <button class="navigation-button" aria-label="Next image" on:click={navigateRight}>
                            {@html rightSvg}
                        </button>
                    </div>
                {/key}
            </div>
        </div>

        <div class="gallery-wrapper">
            <ImageGallery {hit} {selected} {selectImage} />
        </div>

    </div>
{/if}

<Instructions bind:this={instructions} />

<style lang="scss">
    .mturk-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .image-wrapper {
        flex: 1;
    }

    .progress-wrapper {
        background: #333;
        text-align: center;
        color: white;

        .progress-parts {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .progress-ratings {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
        }

        .progress-bar-wrapper {
            height: 2px;
            background: #666;

            .progress-bar {
                height: 100%;
                background: $primary-color;
                box-shadow: 0 0 2px rgba($primary-color, 0.8);
            }
        }

        span {
            display: block;
            padding: 10px;
        }
    }

    .input-wrapper {
        display: flex;
        justify-content: space-between;
        background: #333;
        padding: 10px;
        align-items: center;

        .navigation-button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;

            &:focus {
                outline: none;
            }
        }
    }

    .rating-info {
        flex: 1;
        padding: 10px;
    }

    .button-primary {
        margin: 10px;
        color: #fff;
        background-color: $primary-color;
        border: none;
        border-radius: 3px;
        padding: 10px 20px;
        font-size: 15px;
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

        // Disabled styling
        &:disabled {
            opacity: 0.25;
            cursor: not-allowed;
        }
    }

    .gallery-wrapper {
        padding-bottom: 20px;
    }
</style>