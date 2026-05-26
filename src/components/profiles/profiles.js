import before1 from "@/assets/images/image1.png"
import after1 from "@/assets/images/image2.jpg"
import before2 from "@/assets/images/image3.jpg"
import after2 from "@/assets/images/image4.jpg"
import before3 from "@/assets/images/image1.png"
import after3 from "@/assets/images/image2.jpg"

export const hairProfiles = [
    {
        id: 1,
        before: before1,
        after: after1,
        title: "Crown Area Coverage",
        description: "Seamless density restoration for thinning crown",
        // Position of the highlighted area on the "before" image (percentages)
        highlight: { top: "22%", left: "50%", width: "55%", height: "32%" }
    },
    {
        id: 2,
        before: before2,
        after: after2,
        title: "Frontal Hairline Definition",
        description: "Natural-looking front hairline rebuild",
        highlight: { top: "20%", left: "50%", width: "65%", height: "28%" }
    },
    {
        id: 3,
        before: before3,
        after: after3,
        title: "Temple Area Blend",
        description: "Precision fill for receding temples",
        highlight: { top: "25%", left: "50%", width: "50%", height: "28%" }
    }
]
