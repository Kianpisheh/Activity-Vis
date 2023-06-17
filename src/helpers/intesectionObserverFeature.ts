// useEffect(() => {
//     const options = {
//         root: activitySamplesContainerRef.current,
//         threshold: 0.0,
//         rootMargin: "1000px",
//     };

//     const observerCallback = (entries: IntersectionObserverEntry[]) => {
//         let addedSamples: string[] = [];
//         let removedSamples: string[] = [];
//         for (let i = 0; i < entries.length; i++) {
//             const idd = entries[i].target.getAttribute("sample-id");
//             if (entries[i].isIntersecting && entries[i].target) {
//                 if (idd !== null) {
//                     addedSamples.push(idd);
//                 }
//             } else if (!entries[i].isIntersecting) {
//                 if (idd !== null) {
//                     removedSamples.push(idd);
//                 }
//             }
//         }

//         setVisibleSamples((prevVisibleSamples) => {
//             return [...prevVisibleSamples, ...addedSamples].filter(
//                 (prevVisSample) => !removedSamples.includes(prevVisSample)
//             );
//         });
//     };

//     let observer = new IntersectionObserver(observerCallback, options);
//     activitySampleRefs.current = activitySampleRefs.current.slice(0, activities.length);
//     activitySampleRefs.current.forEach((sampleRef) => {
//         if (sampleRef) {
//             observer.observe(sampleRef);
//         }
//     });

//     return () => {
//         observer.disconnect();
//     };
// }, [activities]);
