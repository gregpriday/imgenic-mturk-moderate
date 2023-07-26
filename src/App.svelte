<script>
    import { onMount, onDestroy } from 'svelte';
    import {generateCloudFlareUrl} from "./lib/util.js";
    import ImageLoupe from "./lib/ImageLoupe.svelte";
    import Instructions from "./lib/Instructions.svelte";
    import ImageGallery from "./lib/ImageGallery.svelte";  // Import the new component

    const targetCount = 4;
    let hit = null;

    let selected = 0;
    let instructions;

    function setRatingsInput(){
        let ratingsInput = document.getElementById('ratings-input');
        ratingsInput.value = JSON.stringify(hit.filter(image => image.selected).map(image => image.id));
    }

    const selectImage = (index) => {
        if(selected === index){
            toggleSelected(index);
        }
        selected = index;
    }

    function preloadImages() {
        hit.forEach(image => {
            const img = new Image();
            img.src = generateCloudFlareUrl(image.image, {quality: 60});
        });
    }

    onMount(() => {
        // Load the hit data
        hit = JSON.parse(document.getElementById('hit-data').value);
        hit.sort(() => Math.random() - 0.5);

        preloadImages();
    });

    function imagesDoneCount(){
        return hit.filter(image => image.selected).length;
    }

    export function toggleSelected(index) {
        if (!hit[index].selected && imagesDoneCount() >= targetCount) {
            // If the image is not selected, and we've already reached the maximum number of selected images,
            // don't allow the image to be selected.
            return;
        }

        hit[index].selected = !hit[index].selected;
        hit = [...hit];
    }
    let isJobComplete = false;
    let doneCount = 0;
    let totalCount = 1;
    $: if (hit) {
        setRatingsInput();
        totalCount = hit.length;
        doneCount = imagesDoneCount();
        isJobComplete = (doneCount === targetCount);
    }
</script>

{#if hit}
    <div class="mturk-wrapper">

        <div class="progress-wrapper">
            <div class="progress-bar-wrapper"><div class="progress-bar" style="width: {doneCount/targetCount * 100}%"></div></div>

            <div class="progress-parts">
                <!-- Display the submit button if the job is complete-->
                <button class="button" type="submit" disabled={!isJobComplete}>Submit Selection</button>
                <div class="progress-ratings">
                    <span>{doneCount}/{targetCount} images selected</span>
                </div>
                <button class="button" on:click|preventDefault={() => {instructions.openModal()}}>Instructions</button>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="image-wrapper">
                {#key hit[selected].image}
                    <ImageLoupe src={hit[selected].image} />
                {/key}
            </div>
            <div class="gallery-wrapper">
                <div class="instructions">
                    <p>
                        Your job is to select the 4 <a href="#criteria" on:click|preventDefault={() => {instructions.openModal('criteria')}}>best images</a> from this batch.
                        Click an image to view it in full, then click it again to select it.
                        Once you've chosen the 4 best images, click <strong>Submit Selection</strong>.
                    </p>
                </div>
                <ImageGallery bind:hit={hit} {selectImage} />
            </div>
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
        // Display as a grid
        display: grid;
        grid-template-columns: 1fr 1fr;

        .image-wrapper {
            flex: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
        }

        .gallery-wrapper {
            flex: 1;

            .instructions {
                display: block;
                padding: 10px;
                margin-bottom: 10px;
                font-size: 14px;
                color: #111;
                background: #eee;

                p {
                    margin: 0;
                }

                a {
                    color: $secondary-color;
                }
            }
        }
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
        background: #222;
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

        .instructions {
            display: block;
            font-size: 14px;
            margin-top: 8px;
            color: #999;

            a {
                color: $primary-color;
            }
        }
    }

    .rating-info {
        flex: 1;
        padding: 10px;
    }

    .button {
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

        &.button-secondary {
            background-color: $secondary-color;
            color: #fff;

            &:hover {
                background-color: lighten($secondary-color, 10%);
            }

            &:active {
                background-color: darken($secondary-color, 10%);
            }
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