import { Composition } from 'remotion'
import { InvitationAnimation } from './InvitationAnimation'

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InvitationAnimation"
      component={InvitationAnimation}
      durationInFrames={210}
      fps={30}
      width={640}
      height={420}
    />
  )
}
