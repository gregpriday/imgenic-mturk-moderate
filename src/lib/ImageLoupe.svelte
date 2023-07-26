<script>
    import { onMount, onDestroy } from 'svelte';

    export let src = '';

    let zoom = 2.5;
    let imgRef;
    let containerRef;

    onMount(() => {
        containerRef.addEventListener("mousemove", moveZoom);

        return () => {
            containerRef.removeEventListener("mousemove", moveZoom);
        }
    });

    function moveZoom(e) {
        e.preventDefault();
        let pos = getCursorPos(e);
        let x = pos.x;
        let y = pos.y;

        const xPercent = (x / containerRef.offsetWidth) * 100;
        const yPercent = (y / containerRef.offsetHeight) * 100;

        imgRef.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    }

    function getCursorPos(e) {
        let a, x = 0, y = 0;
        e = e || window.event;
        a = containerRef.getBoundingClientRect();
        x = e.pageX - a.left - window.scrollX;
        y = e.pageY - a.top - window.scrollY;
        return {x, y};
    }
</script>

<div class="tool-wrapper">
    <div class="image-container" bind:this={containerRef}>
        <img bind:this={imgRef} src={src} alt="Selected Candidate Image" class="candidate-image" style="--scale:{zoom}">
    </div>
</div>

<style lang="scss">
    .tool-wrapper {
        height: 740px;
    }

    .image-container {
        background: #999;
        display: flex;
        position: relative;
        overflow: hidden;
        padding: 35px;

        align-items: center;
        justify-content: center;

        img {
            display: inline-block;
            height: auto;
            width: auto;

            max-width: 100%;
            max-height: 700px;
        }

        &:hover img{
            transform: scale(var(--scale));
        }
    }
</style>
