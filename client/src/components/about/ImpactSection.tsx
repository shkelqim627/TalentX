import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Code2,
    Globe2,
    Leaf,
    Award,
    Laptop
} from 'lucide-react';

const initiatives = [
    {
        icon: Users,
        title: "TalentX Community",
        description: "A global hub for elite professionals to collaborate, mentor, and share expertise."
    },
    {
        icon: Code2,
        title: "Open Source Support",
        description: "Dedicating resources to the technologies that power our modern digital world."
    },
    {
        icon: Globe2,
        title: "Global Opportunity",
        description: "Connecting world-class talent with premier companies, regardless of geography."
    },
    {
        icon: Leaf,
        title: "Sustainability",
        description: "Committed to a carbon-neutral future through remote-first work and ethical green tech."
    },
    {
        icon: Award,
        title: "Excellence Awards",
        description: "Celebrating the most impactful contributions to innovation and talent development."
    },
    {
        icon: Laptop,
        title: "Remote Future",
        description: "Pioneering the tools and culture that define the future of high-performance work."
    }
];

export default function ImpactSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] justify-items-center max-w-[836px] mx-auto">
            {initiatives.map((item, index) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col bg-white border border-gray-100 shadow-sm w-[272px] h-[340px] p-8 text-center"
                >
                    <div className="w-14 h-14 rounded-full border border-[#204ecf]/10 flex items-center justify-center mb-8 mx-auto">
                        <item.icon className="w-6 h-6 text-[#365ecc]" />
                    </div>
                    <h4 className="text-[18px] font-bold text-[#1a1a2e] mb-4">
                        {item.title}
                    </h4>
                    <p className="text-gray-500 text-[14px] leading-relaxed">
                        {item.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
