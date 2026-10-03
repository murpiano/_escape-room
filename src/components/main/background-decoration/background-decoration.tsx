import { BackgroundSetting } from '../../../const/app-const';
import { useAppSelector } from '../../../hooks/store';
import { questSelectors } from '../../../store/slices/quest-slice/quest-slice';

type BackgroundDecorationProps = {
  isBlur?: boolean;
};

function BackgroundDecoration({
  isBlur,
}: BackgroundDecorationProps): JSX.Element {
  const blurImgSize = isBlur
    ? BackgroundSetting.Blur
    : BackgroundSetting.Original;
  const quest = useAppSelector(questSelectors.quest);
  const backgroundImageWebp = quest?.coverImgWebp;
  const backgroundImage = quest?.coverImg;

  if (!backgroundImage) {
    return <div className="decorated-page__decor" aria-hidden="true" />;
  }

  return (
    <div className="decorated-page__decor" aria-hidden="true">
      <picture>
        <source
          type="image/webp"
          srcSet={backgroundImageWebp}
        />
        <img
          src={backgroundImage}
          srcSet={backgroundImage}
          width={1366}
          height={blurImgSize}
          alt=""
        />
      </picture>
    </div>
  );
}

export { BackgroundDecoration };
