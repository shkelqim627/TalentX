import { Talent } from '@/entities/talent/model/types';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface TalentCardProps {
    talent: Talent;
}

export const TalentCard = ({ talent }: TalentCardProps) => {
    // Handling optional user relation safely
    const name = talent.user?.full_name || 'Unknown Talent';
    const initial = name.charAt(0);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {initial}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                            <p className="text-blue-600 font-medium">{talent.title}</p>
                        </div>
                    </div>
                    {talent.availability_status === 'available' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Available
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {talent.bio || "No bio available."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {talent.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {skill}
                        </span>
                    ))}
                    {talent.skills.length > 4 && (
                        <span className="text-gray-400 text-xs py-1">+{talent.skills.length - 4} more</span>
                    )}
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {talent.location || 'Remote'}
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${talent.hourly_rate}/hr
                    </div>
                    {/* <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {talent.experience_years} years exp
                    </div> */}
                </div>
            </div>

            <div className="p-4 border-t border-gray-50 flex gap-2 bg-gray-50">
                <Link href={`/profile/${talent.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
                <Button className="flex-1">Hire Now</Button>
            </div>
        </div>
    );
};
