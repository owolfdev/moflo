import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AuthAvatar() {
  return (
    <Avatar>
      <AvatarImage
        src="https://avatars.githubusercontent.com/u/108033355"
        alt="@owolfdev"
      />
      <AvatarFallback>OW</AvatarFallback>
    </Avatar>
  )
}
