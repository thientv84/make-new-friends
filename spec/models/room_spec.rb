require 'spec_helper'

describe Room do
  it "should create a new room" do
    room = Room.create!( 
                      :sessionId => "16d64958147c0dc1cb6ce067866c531820637a49" )
    room.should be_valid
  end
end
