// CSS Clip Paths that divide any rectangular viewport into three non-overlapping diagonal slices
export const clipPaths = [
  "polygon(0 0, 70% 0, 0 80%)",
  "polygon(70% 0, 100% 0, 100% 50%, 0 80%)",
  "polygon(100% 50%, 100% 100%, 0 100%, 0 80%)",
]

// Framer Motion variants for each individual background slice
export const sliceVariants = [
  // Slice 1: Top-Left Triangle
  {
    enter: (direction) => ({
      x: direction > 0 ? -300 : -150,
      y: direction > 0 ? -200 : -100,
      scale: 0.8,
      opacity: 0,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -150 : -300,
      y: direction > 0 ? -100 : -200,
      scale: 1.15,
      opacity: 0,
    }),
  },
  // Slice 2: Middle Diagonal
  {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      y: direction > 0 ? -150 : 150,
      scale: 1.25,
      opacity: 0,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      y: direction > 0 ? 150 : -150,
      scale: 0.85,
      opacity: 0,
    }),
  },
  // Slice 3: Bottom-Right Triangle
  {
    enter: (direction) => ({
      x: direction > 0 ? 200 : 300,
      y: direction > 0 ? 250 : 150,
      scale: 0.7,
      opacity: 0,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? 300 : 200,
      y: direction > 0 ? 150 : 250,
      scale: 1.2,
      opacity: 0,
    }),
  },
]

// Framer Motion variants for slide text content elements
export const contentVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  },
  title: {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  },
  description: {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  },
  buttons: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
}
