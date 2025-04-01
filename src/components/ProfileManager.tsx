
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProfileManagerProps<T> {
  profiles: T[];
  profileType: string;
  maxProfiles?: number;
  onAddProfile: () => void;
  onRemoveProfile: (id: number) => void;
  renderProfile: (profile: T, index: number) => React.ReactNode;
  getProfileId: (profile: T) => number;
  getProfileTitle: (profile: T) => string;
}

function ProfileManager<T>({
  profiles,
  profileType,
  maxProfiles = 3,
  onAddProfile,
  onRemoveProfile,
  renderProfile,
  getProfileId,
  getProfileTitle
}: ProfileManagerProps<T>) {
  const handleAddProfile = () => {
    if (profiles.length < maxProfiles) {
      onAddProfile();
    } else {
      toast({
        title: "Maximum limit reached",
        description: `You can only add up to ${maxProfiles} ${profileType.toLowerCase()} profiles`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveProfile = (profileId: number) => {
    if (profiles.length > 1) {
      onRemoveProfile(profileId);
    } else {
      toast({
        title: "Cannot remove profile",
        description: `At least one ${profileType.toLowerCase()} profile is required`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {profiles.map((profile, index) => (
        <div key={getProfileId(profile)} className="cell-container mb-8 border p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{getProfileTitle(profile)}</h3>
            {profiles.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveProfile(getProfileId(profile))}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>
          {renderProfile(profile, index)}
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={handleAddProfile} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add {profileType}
        </Button>
      </div>
    </>
  );
}

export default ProfileManager;
