import { motion } from "framer-motion"
import { Phone, MessageCircle, MapPin } from "lucide-react"

const LocationCard = ({ item, index }) => {
    const primaryPhone = item.contacts[0]?.phone.replace(/\s/g, "")

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-2 bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-yellow-500/20 transition-all duration-500 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-72 sm:h-96 lg:h-auto min-h-[420px] overflow-hidden">
                <img
                    src={item.image}
                    alt={`${item.city} studio`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />

                {/* City badge */}
                <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[3px] text-yellow-500">
                    Visit Us
                </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                    {item.city}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-3 mb-7">
                    <MapPin
                        className="w-5 h-5 text-yellow-500 shrink-0 mt-1"
                        strokeWidth={1.75}
                    />
                    <div className="text-gray-300 font-light leading-relaxed">
                        {item.address.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>

                {/* Phone numbers */}
                <div className="space-y-3 mb-8">
                    {item.contacts.map((contact, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Phone
                                className="w-4 h-4 text-yellow-500 shrink-0"
                                strokeWidth={2}
                            />
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                <span className="text-gray-500 text-xs uppercase tracking-[2px]">
                                    {contact.label}
                                </span>
                                <a
                                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                                    className="text-white font-medium hover:text-yellow-500 transition-colors"
                                >
                                    {contact.phone}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <a
                        href={`tel:${primaryPhone}`}
                        className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-7 py-3.5 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Phone className="w-4 h-4" strokeWidth={2.5} />
                        Contact
                    </a>
                    <a
                        href={`https://wa.me/${item.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-white/20 hover:border-yellow-500 hover:text-yellow-500 text-white px-7 py-3.5 rounded-lg font-bold transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
                        WhatsApp
                    </a>
                </div>
            </div>
        </motion.div>
    )
}

export default LocationCard
