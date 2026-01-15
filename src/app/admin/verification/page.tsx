'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AdminVerification() {
    const [profiles, setProfiles] = useState<Database['public']['Tables']['exporter_profiles']['Row'][]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from('exporter_profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .returns<Database['public']['Tables']['exporter_profiles']['Row'][]>();

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await (supabase.from('exporter_profiles') as any)
                .update({ verified: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setProfiles(profiles.map(p =>
                p.id === id ? { ...p, verified: !currentStatus } : p
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update verification status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profiles...</div>;

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-8">Verification Requests</h1>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Docs</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {profiles.map((profile) => (
                            <tr key={profile.id} className="hover:bg-secondary-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-semibold text-secondary-900">{profile.company_name}</div>
                                        {/* email is in profiles table, not exporter_profiles */}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-secondary-600">
                                    {profile.city}, {profile.country}
                                </td>
                                <td className="px-6 py-4">
                                    {profile.certifications && profile.certifications.length > 0 ? (
                                        <div className="flex gap-2">
                                            {profile.certifications.map((cert: string, idx: number) => (
                                                <span key={idx} className="text-xs bg-secondary-100 px-2 py-1 rounded">{cert}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-secondary-400 text-sm">None</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {profile.verified ? (
                                        <Badge variant="success">Verified</Badge>
                                    ) : (
                                        <Badge variant="warning">Pending</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={profile.verified ? "outline" : "primary"}
                                            onClick={() => handleVerify(profile.id, profile.verified)}
                                        >
                                            {profile.verified ? 'Revoke' : 'Approve'}
                                        </Button>
                                        <Button size="sm" variant="ghost">View Details</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {profiles.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-secondary-500">
                                    No profiles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
