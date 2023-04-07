import { array, mixed, number, object, string } from 'yup';

export enum FormNames {
  Channel = 'channel',
  Type = 'type',
  Limit = 'limit',
  Replier = 'replier',
  RewardID = 'rewardId',
  Allowed = 'allowed',
}
export enum InteractionTypes {
  Command = 'command',
  Redeem = 'redeem',
}

export const validationSchema = object({
  [FormNames.Channel]: string().required(),
  [FormNames.Type]: mixed<InteractionTypes>()
    .oneOf(Object.values(InteractionTypes))
    .required(),
  [FormNames.Limit]: number().min(1).required(),
  [FormNames.Replier]: string(),
  [FormNames.RewardID]: string().when(FormNames.Type, ([type]) =>
    type === InteractionTypes.Redeem ? string().required() : string()
  ),
  [FormNames.Allowed]: array(string()).when(FormNames.Type, ([type]) =>
    type === InteractionTypes.Command ? array(string()).min(1) : array(string())
  ),
});

export const initialValues = {
  [FormNames.Channel]: '',
  [FormNames.Type]: InteractionTypes.Command,
  [FormNames.Limit]: 5,
  [FormNames.Replier]: '',
  [FormNames.RewardID]: '',
  [FormNames.Allowed]: [],
};
