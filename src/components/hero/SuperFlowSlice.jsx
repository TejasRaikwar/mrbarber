import { motion } from "framer-motion"

const SuperFlowSlice = ({
  sliceIndex,
  clipPath,
  direction,
  variants,
  imageSrc
}) => {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1], // Custom premium ease-out
      }}
      className="absolute inset-0 h-full w-full"
      style={{
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      {/* Background Image with slow continuous scaling inside slice */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 7, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full"
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover select-none pointer-events-none"
          />
        )}
      </motion.div>
      {/* Dynamic Overlay inside slice */}
      <div className="absolute inset-0 bg-gradient-to-r from-(--media-bg)/85 via-(--media-bg)/55 to-(--media-bg)/75" />
    </motion.div>
  )
}

export default SuperFlowSlice

