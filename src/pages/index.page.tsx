import ComfyJS from 'comfy.js';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import CopyIcon from '@/Icons/Copy';
import LinkIcon from '@/Icons/Link';
import Logo from '@/assets/Logo.png';
import Button from '@/components/Base/Button';
import BaseField from '@/components/Base/Field';
import Checkbox from '@/components/Feature/FormControls/Checkbox';
import Field from '@/components/Feature/FormControls/Field';
import Radio from '@/components/Feature/FormControls/Radio';

import {
  initialValues,
  validationSchema,
  FormNames,
  InteractionTypes,
} from './helper';

export default function Home() {
  const [connected, setConnected] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');

  const handleRewardIdLinking = useCallback(
    (channel: string, setVal: FormikHelpers<FormikValues>['setFieldValue']) => {
      ComfyJS.onConnected = (address, port, isFirstConnect) => {
        setConnected(true);
      };

      ComfyJS.onChat = (user, message, flags, self, extra) => {
        if (flags.customReward)
          setVal(FormNames.RewardID, extra.customRewardId);
      };

      ComfyJS.Init(channel);
    },
    []
  );

  return (
    <main className="bg-gray-700">
      <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Image
              src={Logo}
              alt="OBS Youtube"
              className="w-auto h-40 mx-auto"
            ></Image>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-white">
              OBS Youtube Player Widget
            </h2>
            <p className="mt-2 text-sm text-center text-white">
              An OBS widget for twitch that automatically plays a Youtube video
              when a viewers demands it.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const route =
                values[FormNames.Type] === InteractionTypes.Command
                  ? '/on-command'
                  : '/on-redeem';
              const params = new URLSearchParams();
              params.set(FormNames.Channel, values[FormNames.Channel]);
              params.set(FormNames.Limit, values[FormNames.Limit].toString());
              params.set(FormNames.Replier, values[FormNames.Replier]);

              if (values[FormNames.Type] === InteractionTypes.Redeem)
                params.set(FormNames.RewardID, values[FormNames.RewardID]);

              if (values[FormNames.Type] === InteractionTypes.Command)
                params.set(
                  FormNames.Allowed,
                  values[FormNames.Allowed].join(',')
                );

              setGeneratedLink(
                `${location.origin + route}?${params.toString()}`
              );
            }}
          >
            {({ values, isValid, setFieldValue }) => {
              return (
                <Form className="mt-8 space-y-6">
                  <div className="-space-y-px rounded-md shadow-sm">
                    <Field
                      startComponent={
                        <label
                          htmlFor={FormNames.Channel}
                          className="inline-flex items-center px-3 text-sm text-white bg-gray-800 border border-r-0 rounded-l-md border-black-300"
                        >
                          https://twitch.tv/
                        </label>
                      }
                      type="text"
                      placeholder="Channel Name"
                      name={FormNames.Channel}
                      id={FormNames.Channel}
                    />
                  </div>

                  <fieldset>
                    <legend className="text-base font-medium text-white contents">
                      Command or redeem?
                    </legend>
                    <div className="mt-4 space-y-4">
                      <Radio
                        name={FormNames.Type}
                        id={InteractionTypes.Command}
                        value={InteractionTypes.Command}
                        defaultChecked
                      >
                        <label
                          htmlFor={InteractionTypes.Command}
                          className="flex flex-col ml-3 text-sm font-medium text-white"
                        >
                          <span>Command</span>
                          <em className="italic font-light">
                            !ytwatch !ytstop
                          </em>
                        </label>
                      </Radio>
                      <Radio
                        name={FormNames.Type}
                        id={InteractionTypes.Redeem}
                        value={InteractionTypes.Redeem}
                      >
                        <label
                          htmlFor={InteractionTypes.Redeem}
                          className="block ml-3 text-sm font-medium text-white"
                        >
                          Redeem
                        </label>
                      </Radio>
                    </div>
                  </fieldset>

                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label
                        htmlFor="limit"
                        className="text-base font-medium text-white contents"
                      >
                        Limit in seconds
                      </label>
                      <Field
                        id="limit"
                        type="number"
                        placeholder="Limit"
                        name={FormNames.Limit}
                      />
                    </div>
                  </div>

                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label
                        htmlFor="replier"
                        className="text-base font-medium text-white contents"
                      >
                        Replier
                      </label>
                      <p className="mt-1 mb-2 text-sm text-white">
                        It is possible to leave this section empty. However, in
                        order to receive notifications from the bot, such as{' '}
                        <em>&#34;@user played https://youtu.be/videoId&#34;</em>
                        , it is necessary to authorize your account or your
                        bot&#39;s account on{' '}
                        <a
                          href="http://twitchapps.com/tmi/"
                          className="text-blue-300"
                          target="_blank"
                        >
                          http://twitchapps.com/tmi/
                        </a>
                        . Once the authorization process is complete, please
                        copy and paste the code provided below.
                      </p>
                      <div className="text-base font-medium text-white contents">
                        Example code
                      </div>
                      <code className="block px-2 py-1 mb-2 text-white bg-gray-900 rounded-md">
                        oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      </code>
                      <Field
                        id="replier"
                        type="text"
                        placeholder="Replier"
                        name={FormNames.Replier}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {values[FormNames.Type] === 'redeem' && (
                      <motion.div
                        initial={{ scale: '0%' }}
                        animate={{ scale: '100%' }}
                        exit={{ scale: '0%' }}
                        className="-space-y-px rounded-md shadow-sm"
                      >
                        <label
                          htmlFor="rewardId"
                          className="text-base font-medium text-white contents"
                        >
                          Channel Points reward ID
                        </label>
                        <div>
                          <ol className="my-2 text-sm text-white list-decimal list-inside">
                            <li>
                              Please ensure that you have entered your channel
                              name in the designated field provided above.
                            </li>
                            <li>
                              Click the{' '}
                              <i>
                                <LinkIcon></LinkIcon>
                              </i>{' '}
                              button and wait for it to connect.
                            </li>
                            <li>
                              Redeem your channel point reward on your channel
                              once.
                            </li>
                            <li>It should automatically fill this up.</li>
                          </ol>
                        </div>
                        <div className="flex">
                          <Field
                            type="text"
                            name={FormNames.RewardID}
                            id="rewardId"
                            readOnly
                            endComponent={
                              <button
                                id="rewardIdBtn"
                                type="button"
                                className="inline-flex items-center px-3 text-sm text-white bg-gray-800 border border-l-0 border-gray-300 rounded-r-md"
                                onClick={() =>
                                  handleRewardIdLinking(
                                    values[FormNames.Channel],
                                    setFieldValue
                                  )
                                }
                              >
                                <LinkIcon />
                              </button>
                            }
                            helperText={
                              connected && (
                                <div
                                  className="my-1 text-sm text-green-500"
                                  id="twitchConnected"
                                >
                                  Connected!
                                </div>
                              )
                            }
                          />
                        </div>
                      </motion.div>
                    )}

                    {values[FormNames.Type] === 'command' && (
                      <motion.fieldset
                        initial={{ scale: '0%' }}
                        animate={{ scale: '100%' }}
                        exit={{ scale: '0%' }}
                      >
                        <legend className="text-base font-medium text-white contents">
                          Allowed users
                        </legend>
                        <div className="mt-4 space-y-4">
                          {[
                            'Broadcaster',
                            'Mod',
                            'Founder',
                            'Subscriber',
                            'VIP',
                          ].map((item) => (
                            <div className="flex items-start" key={item}>
                              <div className="flex items-center h-5">
                                <Checkbox
                                  name={FormNames.Allowed}
                                  id={item}
                                  value={item}
                                  label={item}
                                ></Checkbox>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.fieldset>
                    )}
                  </AnimatePresence>

                  <div>
                    <Button type="submit" disabled={!isValid}>
                      Generate link!
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>

          <AnimatePresence>
            {generatedLink && (
              <motion.div
                initial={{ scale: '0%' }}
                animate={{ scale: '100%' }}
                exit={{ scale: '0%' }}
                className="-space-y-px rounded-md shadow-sm"
              >
                <BaseField
                  value={generatedLink}
                  type="text"
                  readOnly
                  endComponent={
                    <button
                      id="copyBtn"
                      className="inline-flex items-center px-3 text-sm text-white bg-gray-800 border border-l-0 border-gray-300 rounded-r-md"
                    >
                      <CopyIcon />
                    </button>
                  }
                />

                <p className="mt-2 text-sm text-center text-white">
                  Copy and paste the link above to your OBS browser source with
                  1280 width and 720 height.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
