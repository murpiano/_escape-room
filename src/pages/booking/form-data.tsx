import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import {
  UserDataForBooking,
  UserDataForLogin,
} from '../../const/template-const';
import { UserDataFieldType } from '../../types/common';
import { ErrorMessage } from '@hookform/error-message';
import { store } from '../../store/store';

type UserDataProps<T extends FieldValues = FieldValues> = {
  field: UserDataFieldType;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

function UserData<T extends FieldValues>({ field, register, errors }: UserDataProps<T>): JSX.Element {
  const userData = Object.keys(UserDataForBooking).includes(field)
    ? UserDataForBooking
    : UserDataForLogin;

  const { name, label, id, pattern, placeholder, error } =
    userData[field as keyof typeof userData];

  let currentPattern = new RegExp(pattern);
  let currentMessage = new String(error) as string;

  if (name === UserDataForBooking.Person.name) {
    const peopleMinMax = store.getState().quest.quest?.peopleMinMax;
    if (peopleMinMax) {
      currentPattern = new RegExp(`^[${peopleMinMax[0]}-${peopleMinMax[1]}]$`);
      currentMessage = new String(
        `Выберите ${peopleMinMax[0]} от ${peopleMinMax[1]} до участников`
      ) as string;
    }
  }

  return (
    <div className="custom-input booking-form__input">
      <label className="custom-input__label" htmlFor={name}>
        {label}
      </label>
      <input
        {...register(name as Parameters<typeof register>[0], {
          required: {
            value: true,
            message: 'Заполните',
          },
          pattern: {
            value: currentPattern,
            message: currentMessage,
          },
        })}
        id={id}
        name={name}
        placeholder={placeholder}
        required
      />
      <ErrorMessage errors={errors} name={name} />
    </div>
  );
}

export { UserData };
