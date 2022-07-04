import { styled } from '../theme/stitches.config';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

const StyledAvatar = styled(AvatarPrimitive.Root, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    userSelect: 'none',
    aspectRatio: '1 / 1',
    backgroundColor: '$neutral3',
});

const StyledImage = styled(AvatarPrimitive.Image, {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit',
});

const StyledFallback = styled(AvatarPrimitive.Fallback, {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$accent3',
    color: '$accent11',
    fontSize: '$4',
    lineHeight: 1,
    fontWeight: '$bold',
});

// Exports
const Avatar = StyledAvatar;
export const AvatarImage = StyledImage;
export const AvatarFallback = StyledFallback;

export default Avatar;
