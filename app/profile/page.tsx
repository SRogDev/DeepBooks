import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileContent } from "@/components/profile/profile-content"

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-4">
      <ProfileHeader />
      <ProfileStats />
      <ProfileContent />
    </div>
  )
}
