import run, { scheduleOnce } from 'ember-runloop';

export default function(subject, callback) {
  run(() => {
    subject.destroy();

    // can't figure out an automated way for the destroy above to run this
    subject.trigger('willDestroyElement');

    scheduleOnce('destroy', callback);
  });
}
